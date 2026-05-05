type LogLevel = "info" | "warn" | "error";

type LogPayload = Record<string, unknown> & {
  message: string;
  context?: string;
  timestamp?: string;
};

function write(level: LogLevel, payload: LogPayload) {
  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    app: "signal-lab",
    ...payload,
  });

  if (level === "error") {
    console.error(line);
    return;
  }

  if (level === "warn") {
    console.warn(line);
    return;
  }

  console.log(line);
}

export const structuredLogger = {
  info: (payload: LogPayload) => write("info", payload),
  warn: (payload: LogPayload) => write("warn", payload),
  error: (payload: LogPayload) => write("error", payload),
};
