"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <span className="text-xl font-bold tracking-tight text-foreground">
            4EX<span className="text-blue-500">PEDIA</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            href="/"
            className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-blue-500 font-bold' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Нүүр хуудас
          </Link>
          <Link 
            href="/posts"
            className={`text-sm font-medium transition-colors ${isActive('/posts') ? 'text-blue-500 font-bold' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Нийтлэл
          </Link>

        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
             <ThemeToggle />
          </div>
          <div className="h-4 w-[1px] bg-border hidden sm:block"></div>
          
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          ) : session?.user ? (
            <div className="hidden sm:flex items-center gap-4">
              <Link href="/profile" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {session.user.image ? (
                  <Image src={session.user.image} alt="Profile" width={32} height={32} className="rounded-full border border-border" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {session.user.name?.[0] || "U"}
                  </div>
                )}
                <span className="hidden lg:inline">{session.user.name?.split(' ')[0]}</span>
              </Link>
              {session.user.role === "ADMIN" && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    Админ
                  </Button>
                </Link>
              )}
              <button 
                onClick={() => signOut({ callbackUrl: "/signin" })}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <>
              <Link href="/signin" className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Нэвтрэх
              </Link>
              <Link href="/signup">
                <button className="hidden sm:block px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-all shadow-lg shadow-blue-900/20">
                  Бүртгүүлэх
                </button>
              </Link>
            </>
          )}

          <button 
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link href="/" className="block text-muted-foreground hover:text-foreground font-medium" onClick={() => setIsOpen(false)}>
              Нүүр хуудас
            </Link>
            <Link href="/posts" className="block text-muted-foreground hover:text-foreground font-medium" onClick={() => setIsOpen(false)}>
              Нийтлэл
            </Link>
            
            <div className="pt-4 border-t border-border">
              {session?.user ? (
                <div className="space-y-4">
                  <Link href="/profile" className="flex items-center gap-3 text-muted-foreground" onClick={() => setIsOpen(false)}>
                    {session.user.image ? (
                      <Image src={session.user.image} alt="Profile" width={32} height={32} className="rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        {session.user.name?.[0] || "U"}
                      </div>
                    )}
                    <span>{session.user.name}</span>
                  </Link>
                  {session.user.role === "ADMIN" && (
                    <Link href="/admin" className="block text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
                      Админ
                    </Link>
                  )}
                  <button 
                    onClick={() => signOut({ callbackUrl: "/signin" })}
                    className="flex items-center gap-2 text-destructive hover:text-destructive/80 w-full"
                  >
                    <LogOut size={18} /> Гарах
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link href="/signin" className="block text-center py-2 text-muted-foreground hover:text-foreground border border-border rounded-lg" onClick={() => setIsOpen(false)}>
                    Нэвтрэх
                  </Link>
                  <Link href="/signup" className="block text-center py-2 bg-blue-600 text-white rounded-lg font-medium" onClick={() => setIsOpen(false)}>
                    Бүртгүүлэх
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

