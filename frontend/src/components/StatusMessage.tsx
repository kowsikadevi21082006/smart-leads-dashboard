import { HTMLAttributes } from "react";
import { cn } from "../utils/cn";

type StatusTone = "success" | "error" | "info";

interface StatusMessageProps extends HTMLAttributes<HTMLDivElement> {
  tone?: StatusTone;
}

const toneClasses: Record<StatusTone, string> = {
  success:
    "border-accent/45 bg-[#171d00] text-white shadow-[0_0_0_1px_rgba(212,255,0,0.12),0_0_18px_rgba(212,255,0,0.08)]",
  error: "border-red-500/35 bg-[#241313] text-red-100",
  info: "border-border bg-[#161616] text-text-primary",
};

const StatusMessage = ({
  tone = "info",
  className,
  children,
  ...props
}: StatusMessageProps) => (
  <div
    className={cn("rounded-lg border px-4 py-3 text-sm leading-6", toneClasses[tone], className)}
    role={tone === "error" ? "alert" : "status"}
    {...props}
  >
    {children}
  </div>
);

export default StatusMessage;
