"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { Menu, X, LogOut, ChevronRight, Shield } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAVBAR_LINKS = [
  { href: "/", label: "Нүүр хуудас" },
  { href: "/posts", label: "Нийтлэл" },
  { href: "/membership", label: "Гишүүн болох" },
] as const;

export function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = useMemo(() => (path: string) => pathname === path, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-all duration-300",
        scrolled ? "bg-background/80 border-border shadow-sm" : "bg-background/0 border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer group">
          <span className="text-xl font-bold tracking-tight text-foreground transition-transform group-hover:scale-105">
            4EX<span className="text-blue-600 dark:text-blue-400">PEDIA</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAVBAR_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400",
                isActive(link.href)
                  ? "text-blue-600 dark:text-blue-400 font-bold"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          <div className="h-6 w-[1px] bg-border/50 hidden sm:block"></div>

          {status === "loading" ? (
            <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />
          ) : session?.user ? (
            <div className="hidden sm:flex items-center gap-3">
              <Link href="/profile" className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-accent/50 transition-colors border border-transparent hover:border-border">
                {session.user.image ? (
                  <Image src={session.user.image} alt="Profile" width={28} height={28} className="rounded-full ring-2 ring-background" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-background">
                    {session.user.name?.[0] || "U"}
                  </div>
                )}
                <span className="text-sm font-medium text-foreground hidden lg:block">{session.user.name?.split(' ')[0]}</span>
              </Link>
              {session.user.role === "ADMIN" && (
                <Link href="/admin">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground">
                    <Shield size={18} />
                  </Button>
                </Link>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut({ callbackUrl: "/signin" })}
                className="h-9 w-9 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut size={18} />
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/signin">
                <Button variant="ghost" className="font-medium text-muted-foreground hover:text-foreground">
                  Нэвтрэх
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 active:scale-95 transition-all">
                  Бүртгүүлэх
                </Button>
              </Link>
            </div>
          )}

          <button
            className="md:hidden p-2 rounded-md hover:bg-accent text-foreground transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden bg-background border-b border-border transition-all duration-300 ease-in-out absolute w-full",
          isOpen ? "max-h-[400px] opacity-100 shadow-lg" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-4 space-y-4">
          <nav className="flex flex-col gap-2">
            {NAVBAR_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl transition-colors",
                  isActive(link.href) ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
                <ChevronRight size={16} className="opacity-50" />
              </Link>
            ))}
          </nav>

          <div className="pt-2 border-t border-border/50">
            {session?.user ? (
              <div className="space-y-3">
                <Link href="/profile" className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent/50 transition-colors" onClick={() => setIsOpen(false)}>
                  {session.user.image ? (
                    <Image src={session.user.image} alt="Profile" width={40} height={40} className="rounded-full ring-2 ring-background" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold ring-2 ring-background">
                      {session.user.name?.[0] || "U"}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{session.user.name}</span>
                    <span className="text-xs text-muted-foreground">{session.user.email}</span>
                  </div>
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link href="/admin">
                    <Button variant="outline" className="w-full justify-start rounded-xl">
                      <Shield size={16} className="mr-2" /> Админ самбар
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  onClick={() => signOut({ callbackUrl: "/signin" })}
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
                >
                  <LogOut size={18} className="mr-2" /> Гарах
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link href="/signin" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full rounded-xl">
                    Нэвтрэх
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl">
                    Бүртгүүлэх
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="flex justify-center pt-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

