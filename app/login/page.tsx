"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { saveToken } from "@/app/components/Buttons/saveButton";
import { API_BASE } from "@/app/lib/config";
import * as React from "react";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg border bg-white text-gray-900 shadow-sm ${
      className || ""
    }`}
    {...props}
  />
));
Card.displayName = "Card";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 ${className || ""}`} {...props} />
));
CardContent.displayName = "CardContent";

export { Card, CardContent };

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Login failed");
      return;
    }

    saveToken(data.accessToken);
    router.push("/dashboard");
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-sm p-6">
        <CardContent>
          <h1 className="text-xl font-bold mb-4">Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500">{error}</p>}
            <Button className="w-full" type="submit">
              Login
            </Button>
          </form>

          <Button
            variant="link"
            className="w-full mt-4"
            onClick={() => router.push("/register")}
          >
            Create an account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${
          className || ""
        }`}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "link";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none";

    const variantStyles = {
      default: "bg-blue-600 text-white hover:bg-blue-700 h-10 py-2 px-4",
      link: "underline-offset-4 hover:underline text-blue-600 h-auto p-0",
    };

    return (
      <button
        className={`${baseStyles} ${variantStyles[variant]} ${className || ""}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
