"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

const LINKS = [
  {
    title: "Grafana Dashboard",
    url: "http://localhost:3100/d/signal-lab-main/signal-lab-dashboard?orgId=1",
    description: "Provisioned metrics and logs dashboard",
  },
  ...(process.env.NEXT_PUBLIC_SENTRY_DASHBOARD_URL
    ? [
        {
          title: "Sentry Dashboard",
          url: process.env.NEXT_PUBLIC_SENTRY_DASHBOARD_URL,
          description: "External error tracking project",
        },
      ]
    : []),
  {
    title: "Sentry Test Page",
    url: "/sentry-example-page",
    description: "Trigger a frontend Sentry test error",
  },
  {
    title: "Prometheus",
    url: "http://localhost:9090",
    description: "Raw metrics & queries",
  },
  {
    title: "Backend Metrics",
    url: "http://localhost:3001/metrics",
    description: "Prometheus scrape endpoint",
  },
  {
    title: "API Docs (Swagger)",
    url: "http://localhost:3001/api/docs",
    description: "Interactive API documentation",
  },
  {
    title: "Loki Logs",
    url: "http://localhost:3100/explore",
    description: "Explore query: {app=\"signal-lab\"}",
  },
];

export function ObsLinks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Observability Links</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {LINKS.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <p className="font-medium text-sm">{link.title}</p>
                <p className="text-xs text-muted-foreground">{link.description}</p>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
