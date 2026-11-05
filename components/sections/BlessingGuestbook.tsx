"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { content } from "@/data/content";
import {
  fetchGuestbookEntries,
  submitGuestbookEntry,
} from "@/lib/guestbook";
import {
  loadStoredGuestbook,
  mergeGuestbookEntries,
  saveGuestbookEntries,
} from "@/lib/guestbook-storage";
import {
  guestbookSchema,
  type GuestbookFormValues,
} from "@/schemas/guestbook";
import type { GuestbookEntry } from "@/types";
import { SECTION_IDS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { GuestbookPhotoFrame } from "@/components/guestbook/GuestbookPhotoFrame";
import { WishesMarquee } from "@/components/guestbook/WishesMarquee";
import {
  SignaturePad,
  type SignaturePadHandle,
} from "@/components/guestbook/SignaturePad";

type SignStep = "idle" | "draw" | "place";

export function BlessingGuestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<SignStep>("idle");
  const [placement, setPlacement] = useState({ x: 42, y: 38 });
  const [draftSignature, setDraftSignature] = useState<string | null>(null);
  const [draftMessage, setDraftMessage] = useState("");
  const signatureRef = useRef<SignaturePadHandle>(null);
  const shouldReduceMotion = useReducedMotion();
  const headingId = "guestbook-heading";
  const wishesHeadingId = "wishes-heading";

  const {
    register,
    getValues,
    reset,
    formState: { errors },
  } = useForm<GuestbookFormValues>({
    resolver: zodResolver(guestbookSchema),
    defaultValues: { name: "", message: "" },
  });

  useEffect(() => {
    let cancelled = false;

    async function loadEntries() {
      try {
        const remote = await fetchGuestbookEntries();
        if (cancelled) return;
        setEntries(mergeGuestbookEntries(remote));
      } catch {
        if (cancelled) return;
        setEntries(mergeGuestbookEntries(loadStoredGuestbook()));
      } finally {
        if (!cancelled) setHydrated(true);
      }
    }

    loadEntries();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveGuestbookEntries(entries);
  }, [entries, hydrated]);

  const signatureEntries = entries.filter((e) =>
    Boolean(e.signatureDataUrl?.trim()),
  );

  const closeFlow = () => {
    setStep("idle");
    setDraftSignature(null);
    setDraftMessage("");
    reset();
    signatureRef.current?.clear();
  };

  const startDraw = () => {
    setStep("draw");
    signatureRef.current?.clear();
  };

  const goToPlacement = () => {
    const message = getValues("message")?.trim() ?? "";
    if (message.length < 2) {
      toast.error(content.guestbook.messageRequired);
      return;
    }
    const dataUrl = signatureRef.current?.toDataURL();
    if (!dataUrl || signatureRef.current?.isEmpty()) {
      toast.error(content.guestbook.signatureRequired);
      return;
    }
    setDraftMessage(message);
    setDraftSignature(dataUrl);
    setPlacement({ x: 42, y: 36 });
    setStep("place");
  };

  const confirmPlacement = async () => {
    if (!draftSignature) return;
    const name = getValues("name")?.trim() ?? "";
    const message = draftMessage;

    setSubmitting(true);
    const createdAt = new Date().toISOString();
    const payload = {
      name,
      message,
      signatureDataUrl: draftSignature,
      positionX: placement.x,
      positionY: placement.y,
      createdAt,
    };

    try {
      const { mode } = await submitGuestbookEntry(payload);

      if (mode === "remote") {
        const remote = await fetchGuestbookEntries();
        setEntries(mergeGuestbookEntries(remote));
        const match = remote.find(
          (e) => e.createdAt === createdAt || e.message === message,
        );
        setLastAddedId(match?.id ?? remote[0]?.id ?? null);
      } else {
        const id = `local-${Date.now()}`;
        const newEntry: GuestbookEntry = {
          id,
          ...payload,
        };
        setEntries((prev) => mergeGuestbookEntries([newEntry], prev));
        setLastAddedId(id);
      }

      toast.success(content.guestbook.success);
      closeFlow();
    } catch {
      toast.error(content.guestbook.error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id={SECTION_IDS.guestbook}
      className="guestbook-section section-shell section-divider py-10 md:py-14"
      aria-labelledby={headingId}
    >
      <Container>
        <Reveal>
          <SectionHeading
            id={headingId}
            title={content.guestbook.title}
            subtitle={content.guestbook.subtitle}
          />
        </Reveal>

        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-start">
          <Reveal delay={0.05}>
            <p className="mb-6 text-center font-serif text-lg italic text-champagne md:text-left md:text-xl">
              {content.guestbook.poeticLine}
            </p>
            <GuestbookPhotoFrame
              entries={signatureEntries}
              lastAddedId={lastAddedId}
              placementMode={step === "place"}
              placementPreview={
                step === "place" && draftSignature
                  ? {
                      dataUrl: draftSignature,
                      x: placement.x,
                      y: placement.y,
                    }
                  : null
              }
              onPlacementMove={(x, y) => setPlacement({ x, y })}
              onOpenSign={startDraw}
            />
            {step === "place" && (
              <p className="mt-3 text-center text-xs text-charcoal-light lg:text-left">
                {content.guestbook.placementHint}
              </p>
            )}
          </Reveal>

          <Reveal delay={0.1}>
            {step === "idle" && (
              <div className="card-elegant rounded-sm p-6 text-center md:p-8">
                <p className="text-sm text-charcoal-light">
                  {content.guestbook.openFormHint}
                </p>
                <Button type="button" className="mt-4 w-full" onClick={startDraw}>
                  {content.guestbook.signCta}
                </Button>
              </div>
            )}

            {step === "draw" && (
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-elegant rounded-sm p-5 md:p-6"
              >
                <h3 className="flex items-center gap-2 font-serif text-lg text-charcoal">
                  <span aria-hidden="true">✎</span>
                  {content.guestbook.drawTitle}
                </h3>
                <p className="mt-1 text-xs text-charcoal-light">
                  {content.guestbook.drawHint}
                </p>

                <div className="mt-4 space-y-3">
                  <Input
                    label={content.guestbook.nameLabel}
                    placeholder={content.guestbook.namePlaceholder}
                    error={errors.name?.message}
                    {...register("name")}
                  />
                  <Textarea
                    label={content.guestbook.messageLabel}
                    placeholder={content.guestbook.messagePlaceholder}
                    rows={2}
                    error={errors.message?.message}
                    {...register("message")}
                  />
                  <SignaturePad ref={signatureRef} height={150} />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1 min-w-[100px]"
                    onClick={() => signatureRef.current?.clear()}
                  >
                    {content.guestbook.clearSignature}
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 min-w-[100px]"
                    onClick={goToPlacement}
                  >
                    {content.guestbook.adjustPosition}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-1 min-w-[100px]"
                    onClick={closeFlow}
                  >
                    {content.guestbook.cancel}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "place" && (
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-elegant rounded-sm p-5 md:p-6"
              >
                <h3 className="font-serif text-lg text-charcoal">
                  {content.guestbook.placementTitle}
                </h3>
                <p className="mt-1 text-sm text-charcoal-light">
                  {content.guestbook.placementHint}
                </p>
                <div className="mt-5 flex flex-col gap-2">
                  <Button
                    type="button"
                    className="w-full"
                    disabled={submitting}
                    onClick={confirmPlacement}
                  >
                    {submitting
                      ? content.guestbook.submitting
                      : content.guestbook.confirmPlace}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={() => setStep("draw")}
                  >
                    {content.guestbook.backToDraw}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={closeFlow}
                  >
                    {content.guestbook.cancel}
                  </Button>
                </div>
              </motion.div>
            )}
          </Reveal>
        </div>

        <Reveal delay={0.12} className="mt-14 md:mt-16">
          <div
            id={SECTION_IDS.wishes}
            className="mx-auto max-w-3xl border-t border-champagne/25 pt-10 md:pt-12"
            aria-labelledby={wishesHeadingId}
          >
            <SectionHeading
              id={wishesHeadingId}
              title={content.wishes.title}
              subtitle={content.wishes.subtitle}
            />
            <div className="mt-6">
              <WishesMarquee entries={entries} highlightId={lastAddedId} />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
