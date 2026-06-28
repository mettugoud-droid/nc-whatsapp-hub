"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: "hsl(var(--card))",
          color: "hsl(var(--card-foreground))",
          border: "1px solid hsl(var(--border))",
        },
      }}
    />
  );
}

// Simple toast utility
export const toast = {
  success: (message: string) => {
    if (typeof window !== "undefined") {
      const event = new CustomEvent("toast", {
        detail: { type: "success", message },
      });
      window.dispatchEvent(event);
    }
  },
  error: (message: string) => {
    if (typeof window !== "undefined") {
      const event = new CustomEvent("toast", {
        detail: { type: "error", message },
      });
      window.dispatchEvent(event);
    }
  },
  info: (message: string) => {
    if (typeof window !== "undefined") {
      const event = new CustomEvent("toast", {
        detail: { type: "info", message },
      });
      window.dispatchEvent(event);
    }
  },
};
