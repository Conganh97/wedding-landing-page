"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      richColors
      toastOptions={{
        className: "font-sans",
        style: {
          background: "#faf8f5",
          color: "#2c2c2c",
          border: "1px solid #c9a96e",
        },
      }}
    />
  );
}
