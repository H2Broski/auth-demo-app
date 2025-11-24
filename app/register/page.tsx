"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { API_BASE } from "@/app/lib/config";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      console.log("Registering at:", `${API_BASE}/auth/register`);
      console.log("Payload:", { username, password });

      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      console.log("Response status:", res.status);

      const data = await res.json();
      console.log("Response data:", data);

      if (!res.ok) {
        setError(data.message || data.error || "Registration failed");
        return;
      }

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        `Error: ${err instanceof Error ? err.message : "Please try again"}`
      );
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <Card className="w-full max-w-sm p-6">
        <CardContent>
          <h1 className="text-xl font-bold mb-4">Create Account</h1>
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              placeholder="Username"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              required
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <Button className="w-full" type="submit">
              Register
            </Button>
          </form>

          <Button
            variant="link"
            className="w-full mt-4"
            onClick={() => router.push("/")}
          >
            Already have an account? Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
