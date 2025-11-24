"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeToken } from "../components/Buttons/saveButton";

export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    console.log("Dashboard: Checking for token...");

    // Direct localStorage check
    const directToken =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    console.log("Dashboard: Direct localStorage check:", directToken);

    // Using getToken function
    const savedToken = getToken();
    console.log("Dashboard: getToken() result:", savedToken);

    if (savedToken) {
      console.log("Dashboard: Token found, setting state");
      setToken(savedToken);
    } else {
      console.log("Dashboard: No token found, redirecting in 3 seconds...");
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
  }, [router]);

  const handleLogout = () => {
    removeToken();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Your Bearer Token:</h2>
            <div className="bg-gray-100 p-4 rounded-md border border-gray-300 break-all">
              <code className="text-sm">{token || "No token found"}</code>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              This is your authentication token. Use it in API requests.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold">Quick Links:</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => router.push("/about")}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                About
              </button>
              <button
                onClick={() => router.push("/education")}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Education
              </button>
              <button
                onClick={() => router.push("/hobbies")}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Hobbies
              </button>
              <button
                onClick={() => router.push("/contact")}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Contact
              </button>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
