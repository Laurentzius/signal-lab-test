"use client";

import * as React from "react";
import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(({ id, title, description, variant }) => (
        <div
          key={id}
          className={`rounded-md border p-4 shadow-lg ${
            variant === "success"
              ? "border-green-500 bg-green-50 text-green-900"
              : variant === "destructive"
              ? "border-red-500 bg-red-50 text-red-900"
              : "border-gray-200 bg-white text-gray-900"
          }`}
        >
          {title && <div className="font-semibold">{title}</div>}
          {description && <div className="text-sm mt-1">{description}</div>}
        </div>
      ))}
    </div>
  );
}
