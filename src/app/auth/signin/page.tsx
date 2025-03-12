import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "./actions";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/10 p-4">
      <div className="w-full max-w-[420px] space-y-8 bg-card rounded-xl shadow-lg p-8 border border-border/40 animate-in fade-in duration-500">
        <div className="space-y-2 text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-primary"
            >
              <path d="M21 8v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5Z" />
              <path d="M10 2v2" />
              <path d="M14 2v2" />
              <path d="M10 20v2" />
              <path d="M14 20v2" />
              <path d="M2 10h2" />
              <path d="M2 14h2" />
              <path d="M20 10h2" />
              <path d="M20 14h2" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to sign in to your account
          </p>
        </div>

        <form className="space-y-5">
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
              className="h-11 transition-all focus-visible:ring-primary/70"
            />
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
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="h-11 transition-all focus-visible:ring-primary/70"
            />
          </div>

          <Button
            formAction={async (formData: FormData) => {
              "use server";
              await login(formData);
            }}
            className="w-full h-11 font-medium transition-all hover:shadow-md"
          >
            Sign In
          </Button>
        </form>

        {/* TODO: Check the google sign in button */}

        {/* <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-3 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="grid gap-3">
          <Button
            variant="outline"
            formAction={async () => {
              "use server"
              console.log("Button clicked, attempting to sign in with Google")
              await signInWithGoogle()
            }}
            className="w-full h-11 font-medium transition-all hover:bg-secondary/50 hover:border-border"
          >
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
            Sign in with Google
          </Button>
        </div> */}

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
