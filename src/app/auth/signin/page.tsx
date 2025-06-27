"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, signInWithGoogle } from "./actions";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    try {
      await login(formData);
      // If successful, redirect will happen server-side
    } catch (err: unknown) {
      setError(
        (err as Error)?.message?.replace("Error signing in:", "") ||
          "Login failed",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    setError("");
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      setError(
        (err as Error)?.message?.replace("Error signing in with Google:", "") ||
          "Google sign-in failed",
      );
      setGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/10 p-4">
      <div className="w-full max-w-[420px] space-y-8 bg-card rounded-xl shadow-lg p-8 border border-border/40 animate-in fade-in duration-500">
        <div className="space-y-2 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Image
              src="/LOGO_V1.png"
              alt="logo"
              width={48}
              height={48}
              className="rounded-full"
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to sign in to your account
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive border border-destructive/30 rounded p-2 text-sm text-center animate-in fade-in mb-2">
            {error}
          </div>
        )}

        <form
          className="space-y-5"
          id="signInForm"
          data-testid="signInForm"
          ref={formRef}
          action={async (formData) => {
            await handleSubmit(formData);
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@gmail.com"
              required
              autoComplete="email"
              aria-required="true"
              aria-label="Email address"
              className="h-11 transition-all focus-visible:ring-primary/70"
            />
            <div className="text-xs text-muted-foreground mt-1">
              Enter your registered email address.
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                aria-required="true"
                aria-label="Password"
                className="h-11 pr-10 transition-all focus-visible:ring-primary/70"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Password must be at least 6 characters.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe((v) => !v)}
              className="accent-primary h-4 w-4 rounded border border-input focus:ring-primary/70"
            />
            <Label
              htmlFor="rememberMe"
              className="text-xs text-muted-foreground cursor-pointer"
            >
              Remember me
            </Label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 font-medium transition-all hover:shadow-md flex items-center justify-center"
          >
            {loading ? (
              <svg
                className="animate-spin mr-2 h-4 w-4 text-primary"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            ) : null}
            Sign In
          </Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-3 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid gap-3">
          <Button
            variant="outline"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full h-11 font-medium transition-all hover:bg-secondary/50 hover:border-border flex items-center justify-center"
          >
            {googleLoading ? (
              <svg
                className="animate-spin mr-2 h-4 w-4 text-primary"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            ) : (
              <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
            )}
            Sign in with Google
          </Button>
        </div>

        <div className="text-center text-sm pt-2">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-primary hover:underline transition-all"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
