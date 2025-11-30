"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <Button
      variant="outline"
      className="justify-center border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
      onClick={() => signOut({ callbackUrl: "/signin" })}
    >
      <LogOut size={18} className="mr-2" />
      Sign Out
    </Button>
  );
}
