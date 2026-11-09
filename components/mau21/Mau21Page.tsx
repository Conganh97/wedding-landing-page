"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { weddingData } from "@/data/wedding";
import { submitGuestbookEntry } from "@/lib/guestbook";
import { submitRsvp } from "@/lib/rsvp";

const WEDDING_AT = new Date(weddingData.weddingDate).getTime();

export function Mau21Page({ html }: { html: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [signing, setSigning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const tick = () => {
      const left = Math.max(0, WEDDING_AT - Date.now());
      const day = Math.floor(left / 86400000);
      const hour = Math.floor((left % 86400000) / 3600000);
      const minute = Math.floor((left % 3600000) / 60000);
      const second = Math.floor((left % 60000) / 1000);
      const set = (id: string, value: number) => {
        const el = root.querySelector<HTMLElement>(`#${id}`);
        if (el) el.textContent = String(value);
      };
      set("cd-day", day);
      set("cd-hour", hour);
      set("cd-min", minute);
      set("cd-sec", second);
    };
    tick();
    const timer = window.setInterval(tick, 1000);

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("#GROUP119, #SECTION8")) {
        setOpen(true);
        window.scrollTo(0, 0);
      }
      if (target.closest("#PARAGRAPH35")) {
        event.preventDefault();
        setSigning(true);
      }
      const option = target.closest<HTMLElement>(".wb-opt-label");
      if (option?.parentElement) {
        option.parentElement.querySelectorAll(".wb-opt-label").forEach((item) => {
          item.classList.remove("active");
        });
        option.classList.add("active");
      }
    };

    const onSubmitClick = async (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest("button");
      if (!button || !root.contains(button)) return;
      if (button.closest(".wb-rsvp-form")) {
        event.preventDefault();
        await sendRsvp(root);
      }
      if (button.closest(".wb-msg-form")) {
        event.preventDefault();
        await sendWish(root);
      }
    };

    root.addEventListener("click", onClick);
    root.addEventListener("click", onSubmitClick);
    return () => {
      window.clearInterval(timer);
      root.removeEventListener("click", onClick);
      root.removeEventListener("click", onSubmitClick);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!signing || !canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    context.scale(2, 2);
    context.strokeStyle = "#c06b4c";
    context.lineWidth = 2.2;
    context.lineCap = "round";

    const point = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      return { x: event.clientX - box.left, y: event.clientY - box.top };
    };
    const down = (event: PointerEvent) => {
      drawing.current = true;
      canvas.setPointerCapture(event.pointerId);
      const { x, y } = point(event);
      context.beginPath();
      context.moveTo(x, y);
    };
    const move = (event: PointerEvent) => {
      if (!drawing.current) return;
      const { x, y } = point(event);
      context.lineTo(x, y);
      context.stroke();
    };
    const up = () => {
      drawing.current = false;
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
    };
  }, [signing]);

  return (
    <div ref={rootRef} className={`mau-root${open ? " is-open" : ""}`}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {signing ? (
        <div className="mau-sig" onClick={() => setSigning(false)}>
          <div className="mau-sig-card" onClick={(event) => event.stopPropagation()}>
            <h3>Ký tên</h3>
            <p>Ký vào khung, rồi gửi cùng lời chúc bên dưới.</p>
            <canvas ref={canvasRef} />
            <div className="mau-sig-actions">
              <button
                type="button"
                onClick={() => {
                  const canvas = canvasRef.current;
                  const context = canvas?.getContext("2d");
                  if (canvas && context) context.clearRect(0, 0, canvas.width, canvas.height);
                }}
              >
                Xóa
              </button>
              <button
                className="primary"
                type="button"
                onClick={() => {
                  const canvas = canvasRef.current;
                  const root = rootRef.current;
                  if (!canvas || !root) return;
                  const message = root.querySelector<HTMLTextAreaElement>(".wb-msg-form textarea")?.value.trim() ?? "";
                  if (message.length < 2) {
                    toast.error("Viết lời chúc ở phần Gửi lời nhắn trước đã nhé.");
                    setSigning(false);
                    root.querySelector("#SECTION2")?.scrollIntoView({ behavior: "smooth", block: "center" });
                    return;
                  }
                  const name = root.querySelector<HTMLInputElement>(".wb-msg-form input")?.value.trim() ?? "";
                  void submitGuestbookEntry({
                    name,
                    message: message.slice(0, 120),
                    signatureDataUrl: canvas.toDataURL("image/png"),
                    positionX: 50,
                    positionY: 62,
                    createdAt: new Date().toISOString(),
                  })
                    .then(() => {
                      toast.success("Đã gửi chữ ký và lời chúc.");
                      setSigning(false);
                    })
                    .catch(() => toast.error("Chưa gửi được. Bạn thử lại giúp mình nhé."));
                }}
              >
                Gửi chữ ký
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

async function sendRsvp(root: HTMLElement) {
  const form = root.querySelector(".wb-rsvp-form");
  if (!form) return;
  const name = form.querySelector<HTMLInputElement>("input.wb-form-input")?.value.trim() ?? "";
  const phone = form.querySelector<HTMLInputElement>(".mau-phone")?.value.trim() ?? "";
  const guestCount = Number(form.querySelector<HTMLSelectElement>(".mau-guest-count")?.value ?? "1");
  const attending = form.querySelector('.wb-opt-label[data-opt="attend"]')?.classList.contains("active") ?? false;
  const declined = form.querySelector('.wb-opt-label[data-opt="decline"]')?.classList.contains("active") ?? false;
  if (name.length < 2) {
    toast.error("Họ và tên phải có ít nhất 2 ký tự.");
    return;
  }
  if (!/^[+]?[\d\s()-]{7,20}$/.test(phone)) {
    toast.error("Vui lòng nhập số điện thoại hợp lệ.");
    return;
  }
  if (!attending && !declined) {
    toast.error("Vui lòng chọn bạn có tham dự hay không.");
    return;
  }
  try {
    await submitRsvp({
      name,
      phone,
      attendance: attending ? "yes" : "no",
      guestCount: attending ? guestCount : undefined,
      message: "",
    });
    toast.success("Đã nhận xác nhận của bạn.");
  } catch {
    toast.error("Chưa gửi được xác nhận. Bạn thử lại giúp mình nhé.");
  }
}

async function sendWish(root: HTMLElement) {
  const form = root.querySelector(".wb-msg-form");
  if (!form) return;
  const name = form.querySelector<HTMLInputElement>("input")?.value.trim() ?? "";
  const message = form.querySelector<HTMLTextAreaElement>("textarea")?.value.trim() ?? "";
  if (message.length < 2) {
    toast.error("Vui lòng viết lời chúc ngắn.");
    return;
  }
  try {
    await submitGuestbookEntry({
      name,
      message: message.slice(0, 120),
      signatureDataUrl: "",
      positionX: 50,
      positionY: 62,
      createdAt: new Date().toISOString(),
    });
    toast.success("Đã gửi lời chúc.");
    const box = form.querySelector("textarea");
    if (box) box.value = "";
  } catch {
    toast.error("Chưa gửi được lời chúc. Bạn thử lại giúp mình nhé.");
  }
}
