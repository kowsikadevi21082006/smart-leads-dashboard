import { HTMLAttributes, ReactNode } from "react";
import { cn } from "../utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: ReactNode;
  hoverable?: boolean;
}

const Card = ({
  title,
  description,
  action,
  hoverable = false,
  className,
  children,
  ...props
}: CardProps) => (
  <div
    className={cn(
      "rounded-2xl border border-border bg-surface p-4 shadow-card",
      hoverable &&
        "transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_0_0_1px_rgba(212,255,0,0.12),0_16px_36px_rgba(0,0,0,0.26)]",
      className
    )}
    {...props}
  >
    {title || description || action ? (
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          {title ? <h3 className="text-lg font-semibold text-text-primary">{title}</h3> : null}
          {description ? <p className="mt-1 text-sm text-text-secondary">{description}</p> : null}
        </div>
        {action}
      </div>
    ) : null}
    {children}
  </div>
);

export default Card;
