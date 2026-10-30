"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { rsvpSchema, type RsvpFormValues } from "@/schemas/rsvp";
import { content } from "@/data/content";
import { submitRsvp } from "@/lib/rsvp";
import {
  RSVP_ERROR_MESSAGE,
  RSVP_SUCCESS_MESSAGE,
  SECTION_IDS,
} from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

const guestCountOptions = Array.from({ length: 10 }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1),
}));

export function RsvpForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const headingId = "rsvp-heading";

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      name: "",
      phone: "",
      attendance: undefined,
      guestCount: undefined,
      message: "",
    },
  });

  const attendance = watch("attendance");
  const isAttending = attendance === "yes";

  const onSubmit = async (values: RsvpFormValues) => {
    setIsSubmitting(true);

    try {
      await submitRsvp(values);
      toast.success(RSVP_SUCCESS_MESSAGE);
      reset();
    } catch {
      toast.error(RSVP_ERROR_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id={SECTION_IDS.rsvp}
      className="section-shell section-rsvp section-divider py-10 md:py-14"
      aria-labelledby={headingId}
    >
      <Container>
        <Reveal>
          <SectionHeading
            id={headingId}
            title={content.rsvp.title}
            subtitle={content.rsvp.subtitle}
          />
        </Reveal>

        <Reveal delay={0.08}>
          <form
          onSubmit={handleSubmit(onSubmit)}
          className="card-elegant mx-auto max-w-lg space-y-6 rounded-sm p-8"
          noValidate
        >
          <Input
            label={content.rsvp.nameLabel}
            placeholder={content.rsvp.namePlaceholder}
            autoComplete="name"
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label={content.rsvp.phoneLabel}
            type="tel"
            placeholder={content.rsvp.phonePlaceholder}
            autoComplete="tel"
            error={errors.phone?.message}
            {...register("phone")}
          />

          <Controller
            name="attendance"
            control={control}
            render={({ field }) => (
              <RadioGroup
                name="attendance"
                legend={content.rsvp.attendanceLegend}
                options={[
                  { value: "yes", label: content.rsvp.attendanceYes },
                  { value: "no", label: content.rsvp.attendanceNo },
                ]}
                value={field.value ?? ""}
                onChange={field.onChange}
                error={errors.attendance?.message}
              />
            )}
          />

          {isAttending && (
            <Controller
              name="guestCount"
              control={control}
              render={({ field }) => (
                <Select
                  label={content.rsvp.guestCountLabel}
                  options={[
                    { value: "", label: content.rsvp.guestCountPlaceholder },
                    ...guestCountOptions,
                  ]}
                  value={field.value ? String(field.value) : ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val ? Number(val) : undefined);
                  }}
                  error={errors.guestCount?.message}
                />
              )}
            />
          )}

          <Textarea
            label={content.rsvp.messageLabel}
            placeholder={content.rsvp.messagePlaceholder}
            error={errors.message?.message}
            {...register("message")}
          />

          <div className="pt-2 text-center">
            <Button
              type="submit"
              isLoading={isSubmitting}
              loadingText={content.rsvp.submitting}
            >
              {content.rsvp.submit}
            </Button>
          </div>
        </form>
        </Reveal>
      </Container>
    </section>
  );
}
