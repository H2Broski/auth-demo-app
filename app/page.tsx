"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { saveToken } from "@/app/components/Buttons/saveButton";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { API_BASE } from "@/app/lib/config";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setIsLoading(false);
        return;
      }

      if (data.accessToken) {
        saveToken(data.accessToken);
        router.push("/dashboard");
      } else {
        setError("No token received");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <Card className="w-full max-w-sm p-6">
        <CardContent>
          <h1 className="text-xl font-bold mb-4">Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <Button
            variant="link"
            className="w-full mt-4"
            onClick={() => router.push("/register")}
            disabled={isLoading}
          >
            Create an account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
