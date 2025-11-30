"use client";

import { Button } from "@/components/ui/button";
import {
  User as UserIcon,
  FileText,
  Mail,
  Calendar,
  Shield,
  CheckCircle,
  Edit2,
  LayoutDashboard
} from "lucide-react";
import { SignOutButton } from "@/components/sign-out-button";
import Link from "next/link";

interface ProfileViewProps {
  user: any;
  stats: {
    postsCount: number;
    joinDate: string;
  };
  posts: any[];
}

export function ProfileView({ user, stats, posts }: ProfileViewProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Profile Card */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
        
        {/* Cover Section */}
        <div className="h-48 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        {/* Profile Header Content */}
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 mb-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl border-4 border-card bg-card shadow-2xl overflow-hidden">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-4xl font-bold">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-card"></div>
            </div>

            {/* User Info */}
            <div className="flex-1 pt-2">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
                {user.role === "ADMIN" && (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 text-xs font-bold tracking-wide uppercase">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-muted-foreground font-medium">{user.email}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              {user.role === "ADMIN" && (
                <Link href="/admin">
                  <Button variant="outline" className="gap-2">
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Button>
                </Link>
              )}
              <SignOutButton />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-t border-border">
            <div className="p-4 rounded-2xl bg-muted/50 border border-border/50">
              <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Role</div>
              <div className="font-bold text-foreground flex items-center gap-2">
                <Shield size={18} className="text-blue-500" />
                {user.role}
              </div>
            </div>
            
            <div className="p-4 rounded-2xl bg-muted/50 border border-border/50">
              <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Joined</div>
              <div className="font-bold text-foreground flex items-center gap-2">
                <Calendar size={18} className="text-purple-500" />
                {stats.joinDate}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-muted/50 border border-border/50">
              <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Posts</div>
              <div className="font-bold text-foreground flex items-center gap-2">
                <FileText size={18} className="text-emerald-500" />
                {stats.postsCount}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-muted/50 border border-border/50">
              <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Status</div>
              <div className="font-bold text-foreground flex items-center gap-2">
                <CheckCircle size={18} className="text-green-500" />
                Active
              </div>
            </div>
          </div>

          {/* Additional Details (if needed) */}
          <div className="pt-8 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Account Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <UserIcon size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium text-foreground">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email Address</p>
                  <p className="font-medium text-foreground">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}