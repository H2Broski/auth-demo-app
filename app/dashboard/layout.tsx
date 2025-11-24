"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/app/components/Buttons/saveButton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Only check auth after component mounts
    const token = getToken();
    if (!token) {
      router.push("/");
    }
  }, [router]);

  return <>{children}</>;
}
