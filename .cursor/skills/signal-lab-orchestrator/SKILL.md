---
name: signal-lab-orchestrator
description: Orchestrates PRD execution through 7 phases with context economy and subagent delegation
---

# Signal Lab Orchestrator

## When to Use

- Implementing a PRD from `prds/` directory
- Breaking down a large feature into atomic tasks
- Resuming interrupted work from `context.json`
- Delegating work to subagents for context efficiency

## Overview

This orchestrator implements a PRD through 7 phases. It **never does the work itself** — it delegates to subagents. This keeps the main context small (~15k tokens) while the heavy work happens in isolated subagent sessions.

## Execution Flow

```
PRD Input → Analysis → Codebase Scan → Planning → Decomposition → Implementation → Review → Report
                ↓            ↓              ↓            ↓               ↓             ↓         ↓
             fast         fast          default      default      fast(80%)/     fast(readonly) fast
                                                                     default(20%)
```

## Instructions

### Step 0: Initialize Execution

When invoked with a PRD path or text:

1. Create execution directory:
   ```
   .execution/<YYYY-MM-DD-HH-MM>/
   ```

2. Create `context.json`:
   ```json
   {
     "executionId": "<timestamp>",
     "prdPath": "prds/XXX_prd-name.md",
     "status": "in_progress",
     "currentPhase": "analysis",
     "phases": {
       "analysis": { "status": "pending" },
       "codebase": { "status": "pending" },
       "planning": { "status": "pending" },
       "decomposition": { "status": "pending" },
       "implementation": { "status": "pending", "completedTasks": 0, "totalTasks": 0 },
       "review": { "status": "pending" },
       "report": { "status": "pending" }
     },
     "signal": 42,
     "tasks": []
   }
   ```

3. If `context.json` already exists in the execution directory, **resume from current phase** (don't restart).

### Phase 1: PRD Analysis (fast model)

**Goal**: Extract requirements, features, constraints from the PRD.

**Subagent prompt**:
```
Analyze this PRD and extract:
1. Functional requirements (F1, F2, ...)
2. Non-functional requirements
3. Technical constraints
4. Dependencies between requirements
5. Acceptance criteria

PRD content:
<prd_content>

Return a structured JSON summary.
```

**Update context.json**: Set `phases.analysis.status = "completed"`, store result.

### Phase 2: Codebase Scan (fast model)

**Goal**: Understand current project structure and existing code.

**Subagent prompt** (use explore agent):
```
Scan the Signal Lab codebase and report:
1. Directory structure (tree)
2. Existing modules and their capabilities
3. What's already implemented vs what's missing
4. Key files and their locations
5. Current tech stack confirmation

Focus on: apps/backend/src/, apps/frontend/src/, prisma/, docker-compose.yml
```

**Update context.json**: Set `phases.codebase.status = "completed"`, store result.

### Phase 3: Planning (default model)

**Goal**: Create high-level implementation plan.

**Subagent prompt**:
```
Based on the PRD analysis and codebase scan, create an implementation plan:

PRD Analysis:
<analysis_result>

Codebase Scan:
<codebase_result>

Plan should include:
1. Ordered list of features to implement
2. For each feature: which files to create/modify
3. Dependencies between features
4. Estimated complexity (low/medium/high)
5. Which features can use fast model vs need default model

Return as structured plan.
```

**Update context.json**: Set `phases.planning.status = "completed"`, store result.

### Phase 4: Decomposition (default model)

**Goal**: Break plan into atomic tasks.

**Subagent prompt**:
```
Decompose this plan into atomic tasks:

Plan:
<planning_result>

Each task must be:
- Completable in 5-10 minutes
- Described in 1-3 sentences
- Tagged with: type (database/backend/frontend/infra), complexity (low/medium/high), model (fast/default)
- Linked to a specific skill if applicable

Format as JSON array of tasks with id, title, description, type, complexity, model, dependencies.

Target: 80%+ tasks should be "fast" model.
```

**Update context.json**: Set `phases.decomposition.status = "completed"`, populate `tasks[]`.

### Phase 5: Implementation (mixed models)

**Goal**: Execute tasks grouped by dependency order.

**Process**:
1. Read `context.json` tasks
2. Group tasks by dependency level (no deps first, then dependents)
3. For each group, launch subagents in parallel:

**Fast model tasks** (80%):
- Add field to Prisma schema
- Create DTO with validation
- Create simple endpoint
- Add metric or log
- Create UI component

**Default model tasks** (20%):
- Architecture decisions
- Complex business logic
- Multi-system integration
- Trade-off analysis

**Subagent prompt template**:
```
Execute this task in the Signal Lab project:

Task: <task_title>
Description: <task_description>
Type: <task_type>

Context:
- Project uses Next.js + NestJS + Prisma + PostgreSQL
- Follow rules in .cursor/rules/
- Follow patterns in .cursor/skills/<relevant-skill>/SKILL.md

Files to modify: <file_list>
Expected outcome: <what_success_looks_like>

After completion, verify:
- Code compiles (no TypeScript errors)
- Follows project conventions
- Observability added if applicable
```

**After each task**: Update `context.json` — set task status to "completed", increment `completedTasks`.

**Retry logic**: If a task fails, retry up to 3 times with default model. If still fails, mark as "failed" and continue.

### Phase 6: Review (fast model, readonly)

**Goal**: Verify implementation quality.

**For each domain** (database, backend, frontend):
```
Review the Signal Lab implementation for <domain>:

Checklist:
1. All PRD requirements implemented?
2. Code follows project conventions (.cursor/rules/)?
3. Observability present (metrics, logs, Sentry)?
4. Error handling proper?
5. TypeScript types correct?
6. Tests passing (if applicable)?

Current state: <recent_changes>
PRD requirements: <relevant_requirements>

Return: pass/fail with specific issues if any.
```

**If review fails**: Launch implementer subagent with feedback, retry up to 3 times.

### Phase 7: Report (fast model)

**Goal**: Generate final execution report.

**Subagent prompt**:
```
Generate execution report for Signal Lab PRD:

Context:
<context_json>

Include:
1. Summary: tasks completed/failed/retried
2. Duration estimate
3. Model usage breakdown (fast vs default tasks)
4. Completed items checklist
5. Failed items (if any) with reasons
6. Next steps / recommendations
7. Verification walkthrough steps

Format as markdown.
```

**Save report**: `.execution/<timestamp>/REPORT.md`

**Update context.json**: Set `status = "completed"`, `phases.report.status = "completed"`.

## Resume Logic

If the orchestrator is invoked and `context.json` exists:

1. Read `context.json`
2. Find first phase with `status != "completed"`
3. Resume from that phase
4. Don't re-execute completed phases or tasks

## Context Economy

- Main orchestrator context: ~15k tokens (just coordination logic)
- Each subagent: fresh context, only relevant files
- Fast model tasks: simple, well-scoped, no architecture decisions
- Default model tasks: complex, multi-file, need judgment

## Error Handling

- If a subagent fails 3 times: mark task as "failed", continue with remaining tasks
- Failed tasks don't block other tasks (unless they're dependencies)
- Final report lists all failures with reasons
- Orchestrator itself never fails — it always produces a report

## Example Usage

```
User: /run-prd prds/002_prd-observability-demo.md

Orchestrator:
1. Creates .execution/2026-04-08-14-30/
2. Reads PRD, extracts requirements
3. Scans codebase
4. Creates plan with 12 tasks
5. Executes tasks (10 fast, 2 default)
6. Reviews implementation
7. Generates report

Result: .execution/2026-04-08-14-30/REPORT.md
```
