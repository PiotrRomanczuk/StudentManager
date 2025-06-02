"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactFormSchema,
  ContactFormData,
} from "@/schemas/contactFormSchema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

const MAX_MESSAGE_LENGTH = 500;

const Contact: React.FC = () => {
  const [status, setStatus] = useState<null | "success" | "error">(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onChange",
    defaultValues: { name: "", email: "", message: "", honeypot: "" },
  });

  const messageValue = watch("message");

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    setStatus(null);
    setTimeout(() => {
      if (data.name && data.email && data.message && !data.honeypot) {
        setStatus("success");
        reset();
      } else {
        setStatus("error");
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <section
      className="flex items-center justify-center bg-gradient-to-b from-white to-indigo-50 py-24 sm:py-32 px-2"
      id="contact"
    >
      <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-lg ring-1 ring-gray-200 transition-shadow duration-300">
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center text-gray-900 tracking-tight">
          Contact Us
        </h2>
        <p className="mb-8 text-center text-lg text-indigo-600 font-medium">
          We&apos;d love to hear from you! Fill out the form below and
          we&apos;ll get back to you soon.
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          autoComplete="off"
          noValidate
        >
          {/* Honeypot field for anti-spam */}
          <div style={{ display: "none" }} aria-hidden="true">
            <Label htmlFor="honeypot">Leave this field empty</Label>
            <Input
              id="honeypot"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register("honeypot")}
            />
          </div>
          <div>
            <Label
              htmlFor="name"
              className="text-base font-semibold text-gray-900"
            >
              Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              {...register("name")}
              required
              className="mt-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-sm transition-all duration-200 placeholder:text-gray-400"
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-red-500 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="email"
              className="text-base font-semibold text-gray-900"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
              required
              className="mt-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-sm transition-all duration-200 placeholder:text-gray-400"
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="message"
              className="text-base font-semibold text-gray-900"
            >
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="How can we help you?"
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
              maxLength={MAX_MESSAGE_LENGTH}
              rows={5}
              {...register("message")}
              required
              className="mt-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-sm transition-all duration-200 resize-y placeholder:text-gray-400"
            />
            <div className="flex justify-between items-center mt-1">
              {errors.message && (
                <p id="message-error" className="text-sm text-red-500">
                  {errors.message.message}
                </p>
              )}
              <span className="text-xs text-gray-500 ml-auto">
                {messageValue?.length || 0}/{MAX_MESSAGE_LENGTH}
              </span>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full flex items-center justify-center py-3 text-lg font-semibold rounded-xl bg-indigo-600 text-white shadow-lg hover:bg-indigo-500 hover:scale-[1.02] active:scale-95 transition-all duration-200 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            disabled={loading || !isValid}
            aria-disabled={loading || !isValid}
          >
            {loading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : null}
            {loading ? "Sending..." : "Send Message"}
          </Button>
          <div aria-live="polite" className="min-h-[56px]">
            {status === "success" && (
              <Alert
                variant="default"
                className="mt-4 flex items-center gap-3 bg-green-50 border-green-200 text-green-800 animate-fade-in-tw"
              >
                <CheckCircle2
                  className="w-6 h-6 text-green-500 shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <AlertTitle className="font-bold">Message sent!</AlertTitle>
                  <AlertDescription>
                    Thank you for reaching out. We&apos;ll get back to you soon.
                  </AlertDescription>
                </div>
              </Alert>
            )}
            {status === "error" && (
              <Alert
                variant="destructive"
                className="mt-4 flex items-center gap-3 bg-red-50 border-red-200 text-red-800 animate-fade-in-tw"
              >
                <XCircle
                  className="w-6 h-6 text-red-500 shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <AlertTitle className="font-bold">
                    Submission failed
                  </AlertTitle>
                  <AlertDescription>
                    Please fill in all fields correctly and try again.
                  </AlertDescription>
                </div>
              </Alert>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;
