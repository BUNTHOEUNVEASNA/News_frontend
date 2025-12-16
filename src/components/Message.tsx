import React, { ReactNode } from "react";

interface MessageProps {
  type?: "error" | "success" | "warning" | "info";
  children: ReactNode;
}

export default function Message({ type = "info", children }: MessageProps) {
  const base = "p-4 rounded-lg text-sm mb-4 ";

  const map = {
    error: "bg-red-100 text-red-700 border border-red-300",
    success: "bg-green-100 text-green-700 border border-green-300",
    warning: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    info: "bg-blue-100 text-blue-700 border border-blue-300",
  } as const;

  return (
    <div role="alert" className={base + map[type]}>
      {children}
    </div>
  );
}
