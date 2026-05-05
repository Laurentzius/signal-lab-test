# /run-prd

Execute a PRD through the orchestrator pipeline.

## Prompt

```
Execute the PRD at the given path using the signal-lab-orchestrator skill.

Path: <prd_path>

Steps:
1. Read the PRD file
2. Create execution directory: .execution/<timestamp>/
3. Initialize context.json
4. Run through all 7 phases:
   - Phase 1: PRD Analysis (fast model)
   - Phase 2: Codebase Scan (fast model, explore agent)
   - Phase 3: Planning (default model)
   - Phase 4: Decomposition (default model)
   - Phase 5: Implementation (mixed: 80% fast, 20% default)
   - Phase 6: Review (fast model, readonly)
   - Phase 7: Report (fast model)
5. Generate final report at .execution/<timestamp>/REPORT.md

Important:
- Orchestrator never does work directly — delegate to subagents
- Each subagent gets fresh context with only relevant files
- Tasks are atomic (5-10 min each)
- Failed tasks retry up to 3 times, then mark as failed
- Completed tasks are never re-executed on resume

Follow the full process in .cursor/skills/signal-lab-orchestrator/SKILL.md
```
