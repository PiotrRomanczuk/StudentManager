import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  honeypot: z.string().max(0, "Spam detected").optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
