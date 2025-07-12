import * as z from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters").max(500, "Message too long"),
  honeypot: z.string().optional(), // Anti-spam field
});

export type ContactFormData = z.infer<typeof contactFormSchema>; 