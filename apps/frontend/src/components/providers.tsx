"use client";

import { QueryProvider } from "@/components/query-provider";
import { ToastProvider } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ToastProvider>
        {children}
        <Toaster />
      </ToastProvider>
    </QueryProvider>
  );
}
