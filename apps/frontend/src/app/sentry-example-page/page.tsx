"use client";

import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function SentryExamplePage() {
  const [eventId, setEventId] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle>Sentry Example Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Click the button to send a frontend test error to Sentry.
          </p>
          <Button
            variant="destructive"
            onClick={() => {
              const error = new Error("Signal Lab frontend Sentry test error");
              const capturedEventId = Sentry.captureException(error);
              setEventId(capturedEventId);
            }}
          >
            Send Frontend Error to Sentry
          </Button>
          {eventId && (
            <p className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
              Error captured. Event ID: <span className="font-mono">{eventId}</span>
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
