import type { ButtonHTMLAttributes } from "react";
import { content } from "@/data/content";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
  loadingText?: string;
};

export function Button({
  className,
  variant = "primary",
  isLoading = false,
  loadingText = content.rsvp.submitting,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-sm px-8 py-3 text-sm font-medium tracking-wide transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "bg-champagne text-white hover:bg-champagne-dark",
        variant === "secondary" &&
          "border border-champagne bg-transparent text-champagne hover:bg-champagne hover:text-white",
        variant === "ghost" &&
          "bg-transparent text-charcoal hover:text-champagne",
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? loadingText : children}
    </button>
  );
}
