"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { content } from "@/data/content";
import { eventsData } from "@/data/events";
import { familyData } from "@/data/family";
import { galleryData } from "@/data/gallery";
import { giftData } from "@/data/gifts";
import { guestbookBoard } from "@/data/guestbook";
import { introStoryData } from "@/data/intro";
import { invitationData } from "@/data/invitation";
import { scheduleData } from "@/data/schedule";
import { thanksData } from "@/data/thanks";
import { weddingData } from "@/data/wedding";
import { SignaturePad, type SignaturePadHandle } from "@/components/guestbook/SignaturePad";
import { buildMonthCalendar, googleCalendarUrl } from "@/lib/calendar-utils";
import { fetchGuestbookEntries, submitGuestbookEntry } from "@/lib/guestbook";
import { submitRsvp } from "@/lib/rsvp";
import { guestbookSchema, type GuestbookFormValues } from "@/schemas/guestbook";
import { rsvpSchema, type RsvpFormValues } from "@/schemas/rsvp";
import type { GuestbookEntry } from "@/types";

const WEEKDAYS = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
const weddingAt = new Date(weddingData.weddingDate);
const ceremony = eventsData[0];
const reception = eventsData[1] ?? eventsData[0];
const mapQuery = `${ceremony.venue}, ${ceremony.address}`;

function gio(time: string) {
  const [hour, minute] = time.split(":");
  return `${Number(hour)} giờ ${minute}`;
}

function CardCorners() {
  return (
    <>
      <svg className="sr-goc tl" aria-hidden="true"><use href="#sr-goc" /></svg>
      <svg className="sr-goc tr" aria-hidden="true"><use href="#sr-goc" /></svg>
      <svg className="sr-goc bl" aria-hidden="true"><use href="#sr-goc" /></svg>
      <svg className="sr-goc br" aria-hidden="true"><use href="#sr-goc" /></svg>
      <span className="sr-the-tt" aria-hidden="true">
        <svg className="chom c1"><use href="#sr-chom-sao" /></svg>
        <svg className="chom c2"><use href="#sr-chom-sao" /></svg>
        <i className="huy"><svg><use href="#sr-sao" /></svg></i>
      </span>
    </>
  );
}

function Photo({ id, src, className }: { id?: string; src: string; className?: string }) {
  return (
    <div id={id} className={`ClientEditImage tmx-anh-trong tmx-bo-qua ${className ?? ""}`}>
      <div className="ladi-image">
        <div className="ladi-image-background" style={{ backgroundImage: `url("${src}")` }} />
      </div>
    </div>
  );
}

function Kicker({ children }: { children: string }) {
  return (
    <div className="sr-kicker sr-hien" data-hieu-ung="len">
      <i className="sr-orn" />
      <div className="ClientEditText sr-nhan"><p className="ladi-headline">{children}</p></div>
      <i className="sr-orn" />
    </div>
  );
}

function Title({ children, oneLine }: { children: string; oneLine?: boolean }) {
  return (
    <div className={`ClientEditText sr-tieu-de sr-hien${oneLine ? " sr-mot-dong" : ""}`} data-hieu-ung="len">
      <h2 className="ladi-headline">{children}</h2>
    </div>
  );
}

function Orbit({ id, src, className }: { id: string; src: string; className?: string }) {
  return (
    <div className={`sr-quy-dao sr-hien${className ? ` ${className}` : ""}`} data-hieu-ung="phong">
      <span className="hao-quang" aria-hidden="true" />
      <span className="sao-quay" aria-hidden="true"><svg><use href="#sr-sao" /></svg></span>
      <span className="sao-quay s2" aria-hidden="true"><svg><use href="#sr-sao" /></svg></span>
      <span className="lap-lanh l1" aria-hidden="true"><svg><use href="#sr-sao" /></svg></span>
      <span className="lap-lanh l2" aria-hidden="true"><svg><use href="#sr-sao" /></svg></span>
      <span className="lap-lanh l3" aria-hidden="true"><svg><use href="#sr-sao" /></svg></span>
      <span className="lap-lanh l4" aria-hidden="true"><svg><use href="#sr-sao" /></svg></span>
      <span className="lap-lanh l5" aria-hidden="true"><svg><use href="#sr-sao" /></svg></span>
      <Photo id={id} src={src} className="anh-tron" />
      <span className="vet-sang" aria-hidden="true" />
    </div>
  );
}

function moThiep() {
  const start = (window as Window & { StartOpenDoor?: () => void }).StartOpenDoor;
  if (start) {
    start();
    return;
  }
  document.getElementById("srCua")?.classList.add("dang-mo", "da-mo");
  document.body.classList.remove("sr-khoa");
  document.documentElement.classList.add("sr-da-mo");
}

function DemNguoc() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const diff = now === null ? 0 : Math.max(0, weddingAt.getTime() - now);
  const parts = [
    [Math.floor(diff / 86400000), content.countdown.days],
    [Math.floor(diff / 3600000) % 24, content.countdown.hours],
    [Math.floor(diff / 60000) % 60, content.countdown.minutes],
    [Math.floor(diff / 1000) % 60, content.countdown.seconds],
  ] as const;

  return (
    <div id="CD_SR" className="edit_countDown" data-cd-style="horizontal" data-cd-item-shape="circle">
      <div className="ladi-html-code" aria-label={content.countdown.ariaLabel}>
        {parts.map(([value, label], index) => (
          <span key={label} style={{ display: "contents" }}>
            {index > 0 ? <span className="countdown-sep">:</span> : null}
            <div className="countdown-item">
              <div className="countdown-shape">
                <span className="countdown-number">{String(value).padStart(2, "0")}</span>
              </div>
              <span className="countdown-label">{label}</span>
            </div>
          </span>
        ))}
      </div>
    </div>
  );
}

function Album() {
  const [index, setIndex] = useState(0);
  const total = galleryData.length;
  return (
    <div id="ALBUM_SR" className="edit_galleryV2">
      <div className="ladi-html-code">
        <div className="wbgv2">
          <button type="button" className="wbgv2-nav prev" aria-label={content.gallery.prev} onClick={() => setIndex((n) => (n - 1 + total) % total)}>‹</button>
          <div className="wbgv2-stage">
            {galleryData.map((image, i) => {
              const delta = (i - index + total) % total;
              const shift = delta > total / 2 ? delta - total : delta;
              const abs = Math.abs(shift);
              return (
                <div
                  key={image.id}
                  className="wbgv2-item"
                  style={{
                    transform: `translateX(${shift * 62}px) scale(${1 - abs * 0.08}) rotateY(${shift * -18}deg)`,
                    opacity: abs > 2 ? 0 : 1,
                    zIndex: 10 - abs,
                  }}
                >
                  <img src={image.src} alt={image.alt} />
                </div>
              );
            })}
          </div>
          <button type="button" className="wbgv2-nav next" aria-label={content.gallery.next} onClick={() => setIndex((n) => (n + 1) % total)}>›</button>
        </div>
      </div>
    </div>
  );
}

function XacNhan() {
  const [guestOf, setGuestOf] = useState<"bride" | "groom">("bride");
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: { attendance: "yes", guestCount: 1, message: "" },
  });
  const attending = watch("attendance") === "yes";

  async function onSubmit(values: RsvpFormValues) {
    setSending(true);
    try {
      await submitRsvp(values);
      setDone(true);
      toast.success(content.rsvp.success);
    } catch {
      toast.error(content.rsvp.error);
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="edit_RPSV">
        <div className="ladi-html-code" style={{ textAlign: "center", padding: "12px 8px 20px" }}>
          <p className="ladi-headline" style={{ fontFamily: "var(--f-script)", fontSize: 36 }}>Đã nhận lời hẹn</p>
          <p style={{ color: "#d6dcef" }}>{content.rsvp.success}</p>
        </div>
      </div>
    );
  }

  return (
    <form className="edit_RPSV" onSubmit={handleSubmit(onSubmit)}>
      <div className="ladi-html-code">
        <label className="wb-form-field">
          <span className="wb-form-label">{content.rsvp.nameLabel}</span>
          <input className="wb-form-input" placeholder={content.rsvp.namePlaceholder} {...register("name")} />
          {errors.name ? <span className="sr-form-error">{errors.name.message}</span> : null}
        </label>
        <label className="wb-form-field">
          <span className="wb-form-label">{content.rsvp.phoneLabel}</span>
          <input className="wb-form-input" inputMode="tel" placeholder={content.rsvp.phonePlaceholder} {...register("phone")} />
          {errors.phone ? <span className="sr-form-error">{errors.phone.message}</span> : null}
        </label>
        <div className="wb-form-field">
          <span className="wb-form-label">Bạn là khách của</span>
          <div className="wb-opt-group">
            <button type="button" className={`wb-opt-label${guestOf === "bride" ? " active" : ""}`} onClick={() => setGuestOf("bride")}>Cô dâu</button>
            <button type="button" className={`wb-opt-label${guestOf === "groom" ? " active" : ""}`} onClick={() => setGuestOf("groom")}>Chú rể</button>
          </div>
        </div>
        <div className="wb-form-field">
          <span className="wb-form-label">{content.rsvp.attendanceLegend}</span>
          <div className="wb-opt-group">
            <label className={`wb-opt-label${attending ? " active" : ""}`}>
              <input type="radio" value="yes" {...register("attendance")} hidden />
              {content.rsvp.attendanceYes}
            </label>
            <label className={`wb-opt-label${!attending ? " active" : ""}`}>
              <input type="radio" value="no" {...register("attendance")} hidden />
              {content.rsvp.attendanceNo}
            </label>
          </div>
        </div>
        {attending ? (
          <label className="wb-form-field">
            <span className="wb-form-label">{content.rsvp.guestCountLabel}</span>
            <select className="wb-form-select" {...register("guestCount", { valueAsNumber: true })}>
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
            {errors.guestCount ? <span className="sr-form-error">{errors.guestCount.message}</span> : null}
          </label>
        ) : null}
        <label className="wb-form-field">
          <span className="wb-form-label">{content.rsvp.messageLabel}</span>
          <textarea className="wb-form-textarea" placeholder={content.rsvp.messagePlaceholder} {...register("message")} />
        </label>
        <button className="wb-submit-btn" type="submit" disabled={sending}>
          {sending ? content.rsvp.submitting : content.rsvp.submit}
        </button>
      </div>
    </form>
  );
}

function LoiChuc() {
  const padRef = useRef<SignaturePadHandle>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<"draw" | "place" | null>(null);
  const [draftSignature, setDraftSignature] = useState<string | null>(null);
  const [placement, setPlacement] = useState({ x: 50, y: 55 });
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [sending, setSending] = useState(false);
  const { register, trigger, reset, getValues, formState: { errors } } = useForm<GuestbookFormValues>({
    resolver: zodResolver(guestbookSchema),
  });

  function closeFlow() {
    setStep(null);
    setDraftSignature(null);
    reset();
  }

  useEffect(() => {
    fetchGuestbookEntries().then(setEntries).catch(() => setEntries([]));
  }, []);

  useEffect(() => {
    if (step !== "draw") return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeFlow();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [step]);

  useEffect(() => {
    if (step !== "place") return;
    document.getElementById("SECTION_KYTEN")?.scrollIntoView({ block: "center" });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setStep("draw");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  function movePlacement(clientX: number, clientY: number) {
    const board = boardRef.current;
    if (!board) return;
    const rect = board.getBoundingClientRect();
    const x = Math.min(88, Math.max(12, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.min(88, Math.max(12, ((clientY - rect.top) / rect.height) * 100));
    setPlacement({ x, y });
  }

  async function goToPlacement() {
    const messageOk = await trigger("message");
    if (!messageOk) return;
    if (!padRef.current || padRef.current.isEmpty()) {
      toast.error(content.guestbook.signatureRequired);
      return;
    }
    const signature = padRef.current.toDataURL();
    if (!signature) {
      toast.error(content.guestbook.signatureRequired);
      return;
    }
    setDraftSignature(signature);
    setPlacement({ x: 50, y: 55 });
    setStep("place");
  }

  async function confirmPlacement() {
    if (!draftSignature) return;
    const message = getValues("message")?.trim() ?? "";
    if (message.length < 2) {
      toast.error(content.guestbook.messageRequired);
      setStep("draw");
      return;
    }
    setSending(true);
    try {
      await submitGuestbookEntry({
        name: getValues("name")?.trim() ?? "",
        message,
        signatureDataUrl: draftSignature,
        positionX: placement.x,
        positionY: placement.y,
        createdAt: new Date().toISOString(),
      });
      const next = await fetchGuestbookEntries();
      setEntries(next);
      closeFlow();
      toast.success(content.guestbook.success);
    } catch {
      toast.error(content.guestbook.error);
    } finally {
      setSending(false);
    }
  }

  const signatures = entries.filter((entry) => entry.signatureDataUrl);

  return (
    <>
      <section id="SECTION_KYTEN" className="sr-phan SEC-Signature SEC-VIP">
        <div className="ladi-section-background" />
        <div className="sr-dau-muc">
          <Kicker>Signature</Kicker>
          <Title>{content.guestbook.title}</Title>
        </div>
        <div className="ClientEditText sr-mo-ta sr-hien" data-hieu-ung="len"><p className="ladi-paragraph">{content.guestbook.poeticLine}</p></div>
      <div className="sr-khung-ky sr-hien" data-hieu-ung="len">
        <div
          className={`nen-ky${step === "place" ? " sr-dang-dat" : ""}`}
          ref={boardRef}
          onPointerDown={(event) => {
            if (step !== "place") return;
            movePlacement(event.clientX, event.clientY);
            try {
              event.currentTarget.setPointerCapture(event.pointerId);
            } catch {
              /* trình duyệt không giữ được con trỏ */
            }
          }}
          onPointerMove={(event) => {
            if (step !== "place" || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
            movePlacement(event.clientX, event.clientY);
          }}
        >
          <Photo id="IMG_KY" src={guestbookBoard.imageSrc} />
          {signatures.map((entry) => (
            <img
              key={entry.id}
              className="sr-ky-anh"
              src={entry.signatureDataUrl}
              alt=""
              style={{ left: `${entry.positionX ?? 36}%`, top: `${entry.positionY ?? 58}%` }}
            />
          ))}
          {step === "place" && draftSignature ? (
            <img
              className="sr-ky-anh sr-ky-xem"
              src={draftSignature}
              alt=""
              style={{ left: `${placement.x}%`, top: `${placement.y}%` }}
            />
          ) : null}
        </div>
        <div id="SIG_SR" className="edit_signature">
          <div className="ladi-html-code" style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 16 }}>
            <button id="wb-sig-open-btn" className="wb-sig-btn" type="button" onClick={() => setStep("draw")}>
              ✎ {content.guestbook.signCta}
            </button>
          </div>
        </div>
      </div>
      </section>

      <div className="sr-vach" aria-hidden="true" />

      <section id="SECTION_LOICHUC" className="sr-phan SEC-Message SEC-VIP">
        <div className="ladi-section-background" />
        <div className="sr-dau-muc">
          <Kicker>Guest Book</Kicker>
          <Title>{content.wishes.title}</Title>
        </div>
        <div className="sr-khung-form sr-the kieu-trang sr-hien" data-hieu-ung="len">
          <CardCorners />
          <i className="trang-khuyet" aria-hidden="true" />
          <div className="ClientEditText sr-ds-loi-chuc sr-ten"><p className="ladi-headline">Lời chúc từ mọi người</p></div>
          <div id="MessageBox">
            {entries.length === 0 ? (
              <div id="MessageBox-placeholder">{content.wishes.empty}</div>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className="MessageBox-item">
                  <p className="MessageBox-item-name">{entry.name || content.wishes.anonymous}</p>
                  <p className="MessageBox-item-message">{entry.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      {step === "draw"
        ? createPortal(
            <div className="sr-ky-popup" onClick={closeFlow}>
              <div
                className="sr-ky-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="sr-ky-title"
                onClick={(event) => event.stopPropagation()}
              >
                <button type="button" className="sr-ky-dong" onClick={closeFlow} aria-label={content.guestbook.cancel}>
                  ×
                </button>
                <h3 id="sr-ky-title">{content.guestbook.drawTitle}</h3>
                <p className="sr-ky-goi-y">{content.guestbook.drawHint}</p>
                <div className="edit_sendMessage">
                  <label className="wb-form-field">
                    <span className="wb-form-label">{content.guestbook.nameLabel}</span>
                    <input className="wb-form-input" placeholder={content.guestbook.namePlaceholder} {...register("name")} />
                  </label>
                  <label className="wb-form-field">
                    <span className="wb-form-label">{content.guestbook.messageLabel}</span>
                    <textarea className="wb-form-textarea" placeholder={content.guestbook.messagePlaceholder} {...register("message")} />
                    {errors.message ? <span className="sr-form-error">{errors.message.message}</span> : null}
                  </label>
                  <div className="sr-ky-pad"><SignaturePad ref={padRef} height={150} /></div>
                  <div className="sr-ky-dat-nut">
                    <button className="sr-ky-phu" type="button" onClick={() => padRef.current?.clear()}>
                      {content.guestbook.clearSignature}
                    </button>
                    <button className="wb-submit-btn" type="button" onClick={goToPlacement}>
                      {content.guestbook.adjustPosition}
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
      {step === "place"
        ? createPortal(
            <div className="sr-ky-dat">
              <p>{content.guestbook.placementHint}</p>
              <div className="sr-ky-dat-nut">
                <button className="sr-ky-phu" type="button" onClick={() => setStep("draw")}>
                  {content.guestbook.backToDraw}
                </button>
                <button className="wb-submit-btn" type="button" disabled={sending} onClick={confirmPlacement}>
                  {sending ? content.guestbook.submitting : content.guestbook.confirmPlace}
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

const DOOR_SPARKS = [
  ["0deg", "120px", "0s"],
  ["20deg", "90px", "0.05s"],
  ["45deg", "140px", "0.1s"],
  ["70deg", "100px", "0.02s"],
  ["95deg", "130px", "0.08s"],
  ["120deg", "85px", "0.12s"],
  ["150deg", "125px", "0.04s"],
  ["175deg", "95px", "0.1s"],
  ["200deg", "135px", "0.06s"],
  ["225deg", "100px", "0s"],
  ["250deg", "120px", "0.09s"],
  ["275deg", "90px", "0.03s"],
  ["300deg", "140px", "0.11s"],
  ["325deg", "105px", "0.07s"],
  ["345deg", "125px", "0.02s"],
] as const;

export function SaoRoiPage() {
  useEffect(() => {
    if (document.getElementById("sr-effect-src")) return;
    const effect = document.createElement("script");
    effect.id = "sr-effect-src";
    effect.src = "/sao-roi-effect.js";
    effect.onload = () => {
      if (document.getElementById("sr-ui-src")) return;
      const ui = document.createElement("script");
      ui.id = "sr-ui-src";
      ui.src = "/sao-roi-ui.js";
      document.body.appendChild(ui);
    };
    document.body.appendChild(effect);
  }, []);

  const cells = buildMonthCalendar(weddingAt.getFullYear(), weddingAt.getMonth(), weddingAt.getDate());
  const calendarHref = googleCalendarUrl({
    title: `Lễ cưới ${weddingData.couple.groomShort} & ${weddingData.couple.brideShort}`,
    startIso: weddingData.weddingDate,
    details: invitationData.quoteTitle,
    location: mapQuery,
  });

  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <symbol id="sr-goc" viewBox="0 0 40 40">
            <path d="M2 30V8a6 6 0 0 1 6-6h22" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity=".7" />
            <path d="M8 1.5l1.1 4.4 4.4 1.1-4.4 1.1L8 12.5 6.9 8.1 2.5 7 6.9 5.9z" fill="currentColor" />
          </symbol>
          <symbol id="sr-chom-sao" viewBox="0 0 90 60">
            <path d="M4 50L22 34L40 40L58 16L84 8M40 40L48 56" fill="none" stroke="currentColor" strokeWidth=".7" strokeDasharray="2 3" opacity=".55" />
            <g fill="currentColor">
              <circle cx="4" cy="50" r="1.6" /><circle cx="22" cy="34" r="2.2" /><circle cx="40" cy="40" r="1.5" />
              <circle cx="58" cy="16" r="2.4" /><circle cx="84" cy="8" r="1.7" /><circle cx="48" cy="56" r="1.3" />
            </g>
          </symbol>
          <symbol id="sr-sao" viewBox="0 0 20 20">
            <path d="M10 0l2.2 7.8L20 10l-7.8 2.2L10 20l-2.2-7.8L0 10l7.8-2.2z" fill="currentColor" />
          </symbol>
        </defs>
      </svg>
      <canvas id="srNen" aria-hidden="true" />
      <canvas id="srHat" aria-hidden="true" />

      <div id="srCua" className="sr-cua UIopenCard" data-thoi-gian="2200" role="dialog" aria-label={invitationData.gateEyebrow}>
        <div className="sr-man">
          <div className="sr-kicker">
            <i className="sr-orn" />
            <div className="ClientEditText sr-nhan"><p className="ladi-headline">{invitationData.gateEyebrow}</p></div>
            <i className="sr-orn" />
          </div>
          <div className="ClientEditText sr-ten-cua sr-tho t1 sr-ten"><h2 className="ladi-headline">{weddingData.couple.groomShort}</h2></div>
          <div className="sr-va-cua">&amp;</div>
          <div className="ClientEditText sr-ten-cua sr-tho t2 sr-ten"><h2 className="ladi-headline">{weddingData.couple.brideShort}</h2></div>
          <div className="ClientEditText sr-ngay-cua sr-phat-sang"><p className="ladi-headline">{invitationData.displayDate}</p></div>
          <div className="sr-moi-cua">
            <div className="ClientEditText kinh-moi"><p className="ladi-headline">{invitationData.gateSubtitle}</p></div>
            <div className="ClientEditText class_tenKhachMoi khach-cua sr-phat-sang"><h3 className="ladi-headline">{invitationData.quoteGuest}</h3></div>
          </div>
          <div>
            <button type="button" id="srNutMo" className="sr-nut-mo Btn_opencard Btn_openMusic" onClick={moThiep}>
              {invitationData.openButton}
            </button>
          </div>
        </div>
      </div>

      <div className="ladi-wraper sr" id="srThiep">
        <section id="SECTION_DAU" className="sr-phan sr-dau">
          <div className="ladi-section-background" />
          <Kicker>{ceremony.title}</Kicker>
          <Orbit id="IMG_DAU" src={weddingData.heroImage} />
          <div className="sr-ten-cap">
            <div className="ClientEditText sr-ten sr-hien" data-hieu-ung="trai"><h1 className="ladi-headline">{weddingData.couple.groomShort}</h1></div>
            <div className="sr-va sr-hien" data-hieu-ung="phong">&amp;</div>
            <div className="ClientEditText sr-ten sr-hien" data-hieu-ung="phai"><h1 className="ladi-headline">{weddingData.couple.brideShort}</h1></div>
          </div>
          <div className="ClientEditText sr-ngay-dau sr-phat-sang sr-hien" data-hieu-ung="len"><p className="ladi-headline">{invitationData.displayDate}</p></div>
          <div className="ClientEditText sr-am-dau sr-hien" data-hieu-ung="len"><p className="ladi-paragraph">{invitationData.lunarDate}</p></div>
          <div className="ClientEditText sr-cau-dau sr-hien" data-hieu-ung="len"><p className="ladi-paragraph">{introStoryData.paragraphs[0]}</p></div>
        </section>

        <div className="sr-vach" aria-hidden="true" />

        <section id="SECTION_HAIHO" className="sr-phan SEC-BrideGroom">
          <div className="ladi-section-background" />
          <div className="sr-dau-muc">
            <Kicker>Hai Họ</Kicker>
            <Title>{content.family.title}</Title>
          </div>
          <div className="sr-gia-dinh sr-the kieu-doi sr-hien" data-hieu-ung="len" id="srGiaDinh">
            <CardCorners />
            <div className="ben" data-ben="trai">
              <div className="ClientEditText ho"><p className="ladi-headline">{familyData.groomSide.label}</p></div>
              <div className="ClientEditText bo-me"><p className="ladi-paragraph">{familyData.groomSide.father}<br />{familyData.groomSide.mother}</p></div>
              <div className="ClientEditText dc"><p className="ladi-paragraph">{familyData.groomSide.address}</p></div>
            </div>
            <div className="giua" aria-hidden="true" />
            <div className="ben" data-ben="phai">
              <div className="ClientEditText ho"><p className="ladi-headline">{familyData.brideSide.label}</p></div>
              <div className="ClientEditText bo-me"><p className="ladi-paragraph">{familyData.brideSide.father}<br />{familyData.brideSide.mother}</p></div>
              <div className="ClientEditText dc"><p className="ladi-paragraph">{familyData.brideSide.address}</p></div>
            </div>
          </div>
          <div className="ClientEditText sr-bao-tin sr-hien" data-hieu-ung="len"><p className="ladi-paragraph">{familyData.announcement}</p></div>
          <div className="sr-doi">
            <div className="sr-hien" data-hieu-ung="trai">
              <Photo id="IMG_CHURE" src={familyData.groomPortrait.src} className="tron-nho" />
              <div className="ClientEditText vai"><p className="ladi-headline">{content.invitation.groomRole}</p></div>
              <div className="ClientEditText ten-ben sr-ten"><h3 className="ladi-headline">{weddingData.couple.groom}</h3></div>
            </div>
            <div className="sr-hien" data-hieu-ung="phai">
              <Photo id="IMG_CODAU" src={familyData.bridePortrait.src} className="tron-nho" />
              <div className="ClientEditText vai"><p className="ladi-headline">{content.invitation.brideRole}</p></div>
              <div className="ClientEditText ten-ben sr-ten"><h3 className="ladi-headline">{weddingData.couple.bride}</h3></div>
            </div>
          </div>
        </section>

        <div className="sr-vach" aria-hidden="true" />

        <section id="SECTION_MOI" className="sr-phan SEC-Invite">
          <div className="ladi-section-background" />
          <div className="sr-dau-muc">
            <Kicker>Thư Mời</Kicker>
            <Title oneLine>{invitationData.quoteTitle}</Title>
          </div>
          <div className="sr-thu sr-the kieu-ve sr-hien" data-hieu-ung="len">
            <i className="ve-lo trai" aria-hidden="true" />
            <i className="ve-lo phai" aria-hidden="true" />
            <CardCorners />
            <div className="ClientEditText trang-trong"><p className="ladi-headline">{invitationData.gateSubtitle}</p></div>
            <div className="ClientEditText class_tenKhachMoi khach sr-ten"><h3 className="ladi-headline">{invitationData.quoteGuest}</h3></div>
            <div className="ClientEditText toi-du"><p className="ladi-paragraph">{invitationData.quoteBody}</p></div>
            <Photo id="IMG_MOI" src={familyData.couplePortrait.src} className="anh-moi" />
            <div className="ClientEditText vao-luc"><p className="ladi-headline">Vào lúc</p></div>
            <div className="ClientEditText gio sr-phat-sang"><p className="ladi-headline">{gio(reception.time)}</p></div>
            <div className="sr-ngay-moi">
              <div className="ClientEditText ben"><p className="ladi-headline">{WEEKDAYS[weddingAt.getDay()]}</p></div>
              <div className="ClientEditText so"><p className="ladi-headline">{weddingAt.getDate()}</p></div>
              <div className="ClientEditText ben"><p className="ladi-headline">Tháng {weddingAt.getMonth() + 1}</p></div>
            </div>
            <div className="ClientEditText nam"><p className="ladi-headline">{weddingAt.getFullYear()}</p></div>
            <div className="ClientEditText am-lich"><p className="ladi-paragraph">({invitationData.lunarDate})</p></div>
            <div className="ClientEditText tai"><p className="ladi-headline">Tại</p></div>
            <div className="ClientEditText noi sr-phat-sang"><p className="ladi-headline">{reception.title}</p></div>
            <div className="ClientEditText noi-ten sr-ten"><p className="ladi-headline">{reception.venue}</p></div>
            <div className="ClientEditText dia-chi"><p className="ladi-paragraph">{reception.address}</p></div>
          </div>
        </section>

        <div className="sr-vach" aria-hidden="true" />

        <section id="SECTION_NGHILE" className="sr-phan SEC-WeddingCeremony">
          <div className="ladi-section-background" />
          <div className="sr-dau-muc">
            <Kicker>Nghi Lễ</Kicker>
            <Title>{ceremony.title}</Title>
          </div>
          <div className="sr-ds-le tmx-nghi-le">
            {eventsData.map((event) => (
              <div key={event.id} className="sr-le sr-the kieu-vom sr-hien" data-hieu-ung="len">
                <CardCorners />
                <div className="bieu-tuong" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="14" r="5.5" /><circle cx="15" cy="14" r="5.5" />
                  </svg>
                </div>
                <div className="ClientEditText ten-le"><h3 className="ladi-headline">{event.title}</h3></div>
                <div className="ClientEditText gio-le"><p className="ladi-headline">{event.time} · {event.date}</p></div>
                <div className="ClientEditText noi-le"><p className="ladi-paragraph">{event.venue}<br />{event.address}</p></div>
              </div>
            ))}
          </div>
        </section>

        <div className="sr-vach" aria-hidden="true" />

        <section id="SECTION_LICH" className="sr-phan SEC-SaveTheDate">
          <div className="ladi-section-background" />
          <div className="sr-dau-muc">
            <Kicker>Save The Date</Kicker>
            <Title>{content.calendar.title}</Title>
          </div>
          <div className="sr-to-lich sr-the kieu-cua-so sr-hien" data-hieu-ung="len">
            <CardCorners />
            <div className="ClientEditText thang-lich"><p className="ladi-headline">Tháng {weddingAt.getMonth() + 1} · {weddingAt.getFullYear()}</p></div>
            <div className="edit_Calendar">
              <div className="ladi-html-code">
                <div className="calendar-wrapper">
                  <div className="calendar-header">
                    <div>T2</div><div>T3</div><div>T4</div><div>T5</div><div>T6</div><div>T7</div><div>CN</div>
                  </div>
                  <div className="calendar-body">
                    {cells.map((cell, i) => (
                      <div key={i} className={`calendar-day${cell.isWeddingDay ? " selected" : ""}${cell.inMonth ? "" : " empty"}`}>
                        {cell.day || ""}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <a className="edit_AddCalendar sr-nut sr-hien" data-hieu-ung="len" target="_blank" rel="noopener noreferrer" href={calendarHref}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18M12 14v4M10 16h4" /></svg>
            {content.formalInvitation.addToCalendar}
          </a>
        </section>

        <div className="sr-vach" aria-hidden="true" />

        <section id="SECTION_DEMNGUOC" className="sr-phan sr-dem SEC-CountDown SEC-VIP">
          <div className="ladi-section-background" />
          <div className="sr-dau-muc">
            <Kicker>Đếm Ngược</Kicker>
            <Title>{content.countdownSection.title}</Title>
          </div>
          <div className="sr-cho-dem sr-hien" data-hieu-ung="phong"><DemNguoc /></div>
          <div className="ClientEditText loi-dem sr-hien" data-hieu-ung="len"><p className="ladi-paragraph">{content.countdownSection.subtitle}</p></div>
        </section>

        <div className="sr-vach" aria-hidden="true" />

        <section id="SECTION_TIMELINE" className="sr-phan SEC-Timeline">
          <div className="ladi-section-background" />
          <div className="sr-dau-muc">
            <Kicker>Timeline</Kicker>
            <Title>{content.schedule.title}</Title>
          </div>
          <div className="sr-tl">
            <div className="edit_Timeline">
              <div className="ladi-html-code">
                <div className="wb-tl">
                  {scheduleData.map((item, index) => (
                    <div className="wb-tl-row" key={item.id}>
                      <div className="wb-tl-time">{item.time}</div>
                      <div className="wb-tl-col">
                        <div className="wb-tl-dot" />
                        {index < scheduleData.length - 1 ? <div className="wb-tl-line" /> : null}
                      </div>
                      <div className="wb-tl-lbl">{item.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="sr-vach" aria-hidden="true" />

        <section id="SECTION_BANDO" className="sr-phan sr-bd SEC-display">
          <div className="ladi-section-background" />
          <div className="sr-dau-muc">
            <Kicker>Bản Đồ</Kicker>
            <Title>{content.venue.title}</Title>
          </div>
          <div className="sr-khung-bd sr-the kieu-cong sr-hien" data-hieu-ung="len" id="srKhungBd">
            <CardCorners />
            <div className="cua-bd" id="srCuaBd">
              <div className="khe" aria-hidden="true" />
              <div className="canh trai" aria-hidden="true"><i className="hoa-van" /><i className="tay" /><i className="mep" /></div>
              <div className="canh phai" aria-hidden="true"><i className="hoa-van" /><i className="tay" /><i className="mep" /></div>
              <div className="khoa" aria-hidden="true"><svg><use href="#sr-sao" /></svg></div>
              <div className="bung" aria-hidden="true">
                {DOOR_SPARKS.map(([g, r, t]) => (
                  <i key={`${g}-${t}`} style={{ ["--g" as string]: g, ["--r" as string]: r, ["--t" as string]: t }} />
                ))}
              </div>
              <div className="loe" aria-hidden="true" />
              <button type="button" className="nut-mo-bd">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></svg>
                <span>{content.events.showMap}</span>
              </button>
            </div>
            <div className="edit_googleMap">
              <div className="ladi-html-code">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=16&output=embed`}
                  width="600"
                  height="450"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={content.events.mapEmbedTitle(ceremony.venue)}
                />
              </div>
            </div>
          </div>
          <div className="ClientEditText dia-chi-bd sr-hien" data-hieu-ung="len">
            <p className="ladi-paragraph">{ceremony.venue}<br />{ceremony.address}</p>
          </div>
        </section>

        <div className="sr-vach" aria-hidden="true" />

        <section id="SECTION_ALBUM" className="sr-phan SEC-Album">
          <div className="ladi-section-background" />
          <div className="sr-dau-muc">
            <Kicker>Album</Kicker>
            <Title>{content.gallery.title}</Title>
          </div>
          <div className="tmx-album-cho sr-hien" data-hieu-ung="len"><Album /></div>
          <div className="ClientEditText sr-album-cau sr-hien" data-hieu-ung="len"><p className="ladi-paragraph">{content.gallery.subtitle}</p></div>
        </section>

        <div className="sr-vach" aria-hidden="true" />

        <LoiChuc />

        <div className="sr-vach" aria-hidden="true" />

        <section id="SECTION_XACNHAN" className="sr-phan SEC-RSVP SEC-VIP">
          <div className="ladi-section-background" />
          <div className="sr-dau-muc">
            <Kicker>RSVP</Kicker>
            <Title>{content.rsvp.title}</Title>
          </div>
          <div className="sr-hien" data-hieu-ung="phong"><Photo id="IMG_XN" src={weddingData.heroImage} className="sr-anh-xn" /></div>
          <div className="ClientEditText sr-mo-ta sr-hien" data-hieu-ung="len"><p className="ladi-paragraph">{content.rsvp.subtitle}</p></div>
          <div className="sr-khung-form sr-the kieu-sao-vien sr-hien" data-hieu-ung="len">
            <CardCorners />
            <XacNhan />
          </div>
        </section>

        <div className="sr-vach" aria-hidden="true" />

        <section id="SECTION_QR" className="sr-phan SEC-QR">
          <div className="ladi-section-background" />
          <div className="sr-dau-muc">
            <Kicker>Mừng Cưới</Kicker>
            <Title>Hộp Mừng Cưới</Title>
          </div>
          <div className="ClientEditText sr-mo-ta sr-hien" data-hieu-ung="len"><p className="ladi-paragraph">{giftData.subtitle}</p></div>
          <div className="sr-qua-vung" id="srQuaVung">
            <div className="sr-hop-lop" id="srHopLop">
              <div className="sr-hop-qua sr-hien" data-hieu-ung="phong" id="srHopQua" role="button" tabIndex={0} aria-label={giftData.cardHint}>
                <span className="hq-hao" aria-hidden="true" />
                <span className="hq-cot" aria-hidden="true" />
                <span className="hq-quy" aria-hidden="true"><i /><i /><i /></span>
                <span className="hq-noi" aria-hidden="true">
                  <span className="hq-than"><i className="bong" /></span>
                  <span className="hq-nap"><i className="no trai" /><i className="no phai" /><i className="nut" /></span>
                </span>
                <span className="hq-tia" aria-hidden="true">
                  {Array.from({ length: 16 }, (_, i) => (
                    <i key={i}><svg><use href="#sr-sao" /></svg></i>
                  ))}
                </span>
              </div>
              <div className="sr-goi-y-hop sr-hien" data-hieu-ung="len">{giftData.cardHint}</div>
            </div>
            <div className="sr-qr" id="srQr">
              {[giftData.groom, giftData.bride].map((side) => (
                <div key={side.roleLabel} className="sr-the-qr sr-the kieu-bao-thu tmx-qr">
                  <CardCorners />
                  <div className="ClientEditText vai-qr tmx-vai-qr"><p className="ladi-headline">{side.roleLabel}</p></div>
                  <Photo src={side.qrSrc} className="anh-qr" />
                  <div className="ClientEditText tk tmx-chu-tk"><p className="ladi-paragraph">{side.name}<br />{side.bankInfo}</p></div>
                </div>
              ))}
            </div>
            <div className="sr-qr-goi-y">Chạm vào mã QR để phóng to</div>
          </div>
        </section>

        <div className="sr-vach" aria-hidden="true" />

        <section id="SECTION_KET" className="sr-phan sr-ket SEC-End">
          <div className="ladi-section-background" />
          <Orbit id="IMG_KET" src={thanksData.imageSrc} className="bau-duc" />
          <div className="ClientEditText cam-on sr-ten sr-hien" data-hieu-ung="len"><h2 className="ladi-headline">{content.thanks.title}</h2></div>
          <div className="ClientEditText loi-ket sr-hien" data-hieu-ung="len"><p className="ladi-paragraph">{content.thanks.message}</p></div>
          <div className="ClientEditText sr-ky sr-hien" data-hieu-ung="len"><p className="ladi-headline">{weddingData.couple.groomShort} &amp; {weddingData.couple.brideShort}</p></div>
        </section>
      </div>
    </>
  );
}
