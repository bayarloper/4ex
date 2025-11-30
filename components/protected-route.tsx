"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProtectedRoute({ children, allowedRoles }: { 
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/signin");
      return;
    }

    if (allowedRoles && !allowedRoles.includes(session.user.role)) {
      router.push("/");
    }
  }, [session, status, router, allowedRoles]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">Access Denied</div>
      </div>
    );
  }

  return <>{children}</>;
}
