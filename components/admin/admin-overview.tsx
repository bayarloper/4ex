"use client";

import { TrendingUp, Users, FileText, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface AdminOverviewProps {
  users: any[];
  posts: any[];
}

export function AdminOverview({ users, posts }: AdminOverviewProps) {
  const memberCount = users.filter(u => u.role === "MEMBER").length;
  const totalRevenue = memberCount * 15; // Assuming $15/mo

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Revenue Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-slate-400 text-sm font-medium mb-2">Total Revenue</p>
          <h3 className="text-3xl font-bold text-white mb-2">${totalRevenue.toLocaleString()}</h3>
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
            <TrendingUp size={16} />
            <span>+12.5% from last month</span>
          </div>
        </div>

        {/* Subscribers Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-slate-400 text-sm font-medium mb-2">Active Subscribers</p>
          <h3 className="text-3xl font-bold text-white mb-2">{memberCount}</h3>
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
            <Users size={16} />
            <span>+5.2% new users</span>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-slate-400 text-sm font-medium mb-2">Content Pieces</p>
          <h3 className="text-3xl font-bold text-white mb-2">{posts.length}</h3>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <FileText size={16} />
            <span>News, Courses, Quizzes</span>
          </div>
        </div>
      </div>

      {/* Content Library Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Content Library</h3>
          <Link href="/posts/new">
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              + Create New Post
            </button>
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2 text-white font-semibold">
              <FileText size={18} className="text-slate-400" />
              Latest News
            </div>
            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded">
              Total: {posts.length}
            </span>
          </div>

          <div className="divide-y divide-slate-800">
            {posts.slice(0, 5).map((post: any) => (
              <div key={post.id} className="p-4 hover:bg-slate-800/50 transition-colors flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-800 rounded-lg flex-shrink-0 overflow-hidden relative">
                  {post.featuredImage ? (
                    <Image src={post.featuredImage} alt="" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <FileText size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium truncate">{post.title}</h4>
                  <p className="text-slate-400 text-sm truncate mt-1">
                    {post.content?.replace(/<[^>]*>/g, "").substring(0, 60)}...
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {post.category || "News"}
                    </span>
                    {post.category === "Premium" && (
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                        PREMIUM
                      </span>
                    )}
                  </div>
                </div>
                <Link href={`/posts/${post.id}`}>
                  <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                    <ArrowUpRight size={18} />
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
