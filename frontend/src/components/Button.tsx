import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../utils/cn";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "rounded-lg bg-[#D4FF00] text-black shadow-[0_0_0_1px_rgba(212,255,0,0.12)] hover:shadow-[0_0_0_1px_rgba(212,255,0,0.24),0_0_18px_rgba(212,255,0,0.42)] hover:-translate-y-0.5 disabled:hover:translate-y-0",
  secondary:
    "rounded-lg border border-[#D4FF00]/28 bg-[#1A1A1A] text-white hover:border-[#D4FF00]/55 hover:text-[#D4FF00] hover:shadow-[0_0_0_1px_rgba(212,255,0,0.18),0_0_14px_rgba(212,255,0,0.14)]",
  danger:
    "rounded-lg bg-[#D4FF00] text-black shadow-[0_0_0_1px_rgba(212,255,0,0.12)] hover:shadow-[0_0_0_1px_rgba(212,255,0,0.24),0_0_18px_rgba(212,255,0,0.42)] hover:-translate-y-0.5 disabled:hover:translate-y-0",
  ghost:
    "rounded-lg border border-border bg-surface text-text-primary hover:border-accent/30 hover:bg-[#202020] hover:text-white",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
};

const Spinner = () => (
  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
);

const Button = ({
  className,
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  leftIcon,
  ...props
}: ButtonProps) => (
  <button
    className={cn(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60",
      variantClasses[variant],
      sizeClasses[size],
      className
    )}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? <Spinner /> : leftIcon}
    <span>{children}</span>
  </button>
);

export default Button;
