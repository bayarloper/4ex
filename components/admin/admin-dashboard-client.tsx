"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  PlusCircle,
  Search,
  Bell
} from "lucide-react";
import { UserManagement } from "./user-management";
import { AdminOverview } from "./admin-overview";
import { AdminNews } from "./admin-news";
import { AdminTerms } from "./admin-terms";
import { Button } from "@/components/ui/button";

interface AdminDashboardClientProps {
  users: any[];
  posts: any[];
  terms: any[];
}

export function AdminDashboardClient({ users, posts, terms }: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "news" | "terms">("overview");

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              4EX
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none">Admin Panel</h1>
              <p className="text-xs text-slate-400 mt-1">Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "overview" 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "users" 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            <Users size={20} />
            <span className="font-medium">Manage Users</span>
          </button>

          <button
            onClick={() => setActiveTab("news")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "news" 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            <FileText size={20} />
            <span className="font-medium">News & Courses</span>
          </button>

          <button
            onClick={() => setActiveTab("terms")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "terms" 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            <FileText size={20} />
            <span className="font-medium">Terms & Glossary</span>
          </button>

          <div className="pt-4 mt-4 border-t border-slate-800">
            <Link href="/posts/new">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-blue-400 transition-all group">
                <PlusCircle size={20} className="group-hover:text-blue-400" />
                <span className="font-medium">Create New Post</span>
              </button>
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">

          <Link href="/">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all">
              <LogOut size={20} />
              <span className="font-medium">Exit Admin</span>
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">
            {activeTab === "overview" && "Overview"}
            {activeTab === "users" && "User Management"}
            {activeTab === "news" && "News & Courses"}
            {activeTab === "terms" && "Terms & Glossary"}
          </h2>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-slate-900 border border-slate-800 text-slate-200 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 w-64"
              />
            </div>
            <button className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === "overview" && <AdminOverview users={users} posts={posts} />}
          {activeTab === "users" && <UserManagement initialUsers={users} />}
          {activeTab === "news" && <AdminNews posts={posts} />}
          {activeTab === "terms" && <AdminTerms terms={terms} />}
        </div>
      </main>
    </div>
  );
}
