import {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "../utils/cn";

type BaseFieldProps = {
  label?: string;
  hint?: string;
  error?: string;
  icon?: ReactNode;
  containerClassName?: string;
  className?: string;
};

type InputFieldProps = BaseFieldProps &
  InputHTMLAttributes<HTMLInputElement> & {
    as?: "input";
  };

type SelectFieldProps = BaseFieldProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    as: "select";
    children: ReactNode;
  };

type TextareaFieldProps = BaseFieldProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    as: "textarea";
  };

type FieldProps = InputFieldProps | SelectFieldProps | TextareaFieldProps;

export const fieldClassName =
  "w-full rounded-lg border border-border bg-[#141414] px-4 py-2.5 text-sm text-text-primary outline-none transition-all duration-200 placeholder:text-text-secondary/65 focus:border-accent focus:bg-[#1A1A1A] focus:shadow-[0_0_0_1px_rgba(212,255,0,0.16)] disabled:cursor-not-allowed disabled:opacity-60";

const Input = (props: FieldProps) => {
  const {
    label,
    hint,
    error,
    icon,
    containerClassName,
    className,
    as = "input",
    ...rest
  } = props as FieldProps & { as?: "input" | "select" | "textarea" };

  const sharedProps = {
    className: cn(
      fieldClassName,
      Boolean(icon) && "pl-11",
      as === "select" && "appearance-none",
      as === "textarea" && "min-h-[120px] resize-y",
      className
    ),
  };

  return (
    <label className={cn("flex flex-col gap-2", containerClassName)}>
      {label ? <span className="text-sm font-medium text-text-primary">{label}</span> : null}
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
            {icon}
          </span>
        ) : null}

        {as === "select" ? (
          <>
            <select {...(rest as SelectFieldProps)} {...sharedProps} />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary">
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="m5 7.5 5 5 5-5" />
              </svg>
            </span>
          </>
        ) : null}

        {as === "textarea" ? (
          <textarea {...(rest as TextareaFieldProps)} {...sharedProps} />
        ) : null}

        {as === "input" ? (
          <input {...(rest as InputFieldProps)} {...sharedProps} />
        ) : null}
      </div>
      {error ? <span className="text-sm text-red-300">{error}</span> : null}
      {!error && hint ? <span className="text-xs text-text-secondary">{hint}</span> : null}
    </label>
  );
};

export default Input;
