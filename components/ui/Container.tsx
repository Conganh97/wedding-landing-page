import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
  id?: string;
  ariaLabelledby?: string;
};

export function Container({
  children,
  className,
  as: Component = "div",
  id,
  ariaLabelledby,
}: ContainerProps) {
  return (
    <Component
      id={id}
      aria-labelledby={ariaLabelledby}
      className={cn("mx-auto w-full max-w-[430px] px-5", className)}
    >
      {children}
    </Component>
  );
}
