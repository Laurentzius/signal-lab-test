"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";

interface ScenarioRun {
  id: string;
  type: string;
  status: string;
  duration: number | null;
  error: string | null;
  createdAt: string;
}

function getStatusVariant(status: string) {
  switch (status) {
    case "completed":
      return "success";
    case "error":
      return "destructive";
    default:
      return "warning";
  }
}

function formatDuration(ms: number | null) {
  if (ms === null) return "—";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function RunHistory() {
  const { data: runs, isLoading } = useQuery<ScenarioRun[]>({
    queryKey: ["scenarios"],
    queryFn: () => apiFetch("/api/scenarios"),
    refetchInterval: 5000,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Run History</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : !runs || runs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No runs yet. Run a scenario above.</p>
        ) : (
          <div className="space-y-3">
            {runs.map((run) => (
              <div
                key={run.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-white"
              >
                <div className="flex items-center gap-3">
                  <Badge variant={getStatusVariant(run.status)}>
                    {run.status}
                  </Badge>
                  <div>
                    <p className="font-medium text-sm">{run.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(run.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono">{formatDuration(run.duration)}</p>
                  {run.error && (
                    <p className="text-xs text-red-500 truncate max-w-[200px]">
                      {run.error}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
