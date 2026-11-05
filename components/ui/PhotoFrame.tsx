import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type PhotoFrameProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  /** Nhẹ xoay như ảnh để bàn */
  tilt?: boolean;
};

export function PhotoFrame({
  children,
  className,
  innerClassName,
  tilt = false,
}: PhotoFrameProps) {
  return (
    <div
      className={cn(
        "photo-frame-ornate flex flex-col",
        tilt && "photo-frame-ornate--tilt",
        className,
      )}
    >
      <span className="photo-frame-corner photo-frame-corner-tl" aria-hidden="true" />
      <span className="photo-frame-corner photo-frame-corner-tr" aria-hidden="true" />
      <span className="photo-frame-corner photo-frame-corner-bl" aria-hidden="true" />
      <span className="photo-frame-corner photo-frame-corner-br" aria-hidden="true" />
      <div className={cn("photo-frame-inner relative min-h-0 flex-1", innerClassName)}>
        {children}
      </div>
    </div>
  );
}
