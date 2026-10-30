import { z } from "zod";

export const guestbookSchema = z.object({
  name: z.string().trim().max(80, "Họ tên quá dài").optional(),
  message: z
    .string()
    .trim()
    .min(2, "Vui lòng viết lời chúc ngắn")
    .max(120, "Lời chúc tối đa 120 ký tự"),
});

export type GuestbookFormValues = z.infer<typeof guestbookSchema>;
