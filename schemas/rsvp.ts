import { z } from "zod";

export const rsvpSchema = z
  .object({
    name: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
    phone: z
      .string()
      .min(7, "Vui lòng nhập số điện thoại hợp lệ")
      .regex(/^[+]?[\d\s()-]{7,20}$/, "Vui lòng nhập số điện thoại hợp lệ"),
    attendance: z.enum(["yes", "no"], {
      message: "Vui lòng chọn bạn có tham dự hay không",
    }),
    guestCount: z.number().min(1).max(10).optional(),
    message: z
      .string()
      .max(500, "Lời nhắn không được quá 500 ký tự")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.attendance === "yes") {
      if (!data.guestCount || data.guestCount < 1 || data.guestCount > 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Số lượng khách phải từ 1 đến 10",
          path: ["guestCount"],
        });
      }
    }
  });

export type RsvpFormValues = z.infer<typeof rsvpSchema>;
