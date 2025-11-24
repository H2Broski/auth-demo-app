"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveToken } from "@/app/components/Buttons/saveButton";
import { API_BASE } from "@/app/lib/config";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check for success message from registration
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get("message");
    if (message) {
      setSuccess(message);
    }
  }, []);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
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

      saveToken(data.accessToken);
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl text-white font-bold">📚</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-lg">
            Sign in to your library account
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border-0 bg-white/80 backdrop-blur-sm text-gray-900 shadow-xl w-full border-0 shadow-2xl">
          <div className="flex flex-col space-y-1.5 p-6 pb-4 text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">Login</h2>
            <p className="text-gray-500 text-sm">
              Enter your credentials to continue
            </p>
          </div>
          <div className="p-6 pt-0 space-y-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoading}
                    className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm flex items-center">
                  <span className="mr-2">✅</span>
                  {success}
                </div>
              )}

              <button
                className="w-full py-3 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none inline-flex items-center justify-center rounded-xl text-base font-semibold focus-visible:outline-none disabled:pointer-events-none h-12 px-4"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/80 text-gray-500">
                  New to our library?
                </span>
              </div>
            </div>

            {/* Register Link */}
            <button
              className="w-full py-3 text-gray-700 hover:text-gray-900 font-semibold rounded-xl transition-all border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 inline-flex items-center justify-center rounded-xl text-base font-semibold focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-12 px-4"
              onClick={() => router.push("/register")}
              disabled={isLoading}
            >
              Create New Account
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Library Management System © 2024
          </p>
        </div>
      </div>
    </div>
  );
}
