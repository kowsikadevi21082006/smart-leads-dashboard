import { LeadSource, LeadStatus } from "../types";
import { cn } from "../utils/cn";

type BadgeTone =
  | "default"
  | "new"
  | "contacted"
  | "qualified"
  | "lost"
  | "source";

interface BadgeProps {
  children: string;
  tone?: BadgeTone;
}

const toneClasses: Record<BadgeTone, string> = {
  default: "border-border bg-surface-2 text-text-secondary",
  new: "border-zinc-600 bg-zinc-800 text-zinc-200",
  contacted: "border-blue-500/30 bg-blue-500/14 text-blue-200",
  qualified: "border-emerald-500/30 bg-emerald-500/14 text-emerald-200",
  lost: "border-red-500/30 bg-red-500/14 text-red-200",
  source: "border-accent/20 bg-accent/10 text-accent",
};

export const getStatusTone = (status: LeadStatus): BadgeTone => {
  switch (status) {
    case "New":
      return "new";
    case "Contacted":
      return "contacted";
    case "Qualified":
      return "qualified";
    case "Lost":
      return "lost";
    default:
      return "default";
  }
};

export const getSourceTone = (_source: LeadSource): BadgeTone => "source";

const Badge = ({ children, tone = "default" }: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
      toneClasses[tone]
    )}
  >
    {children}
  </span>
);

export default Badge;
