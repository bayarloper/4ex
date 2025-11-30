"use client";

import { FileText, Search, Filter, MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminNewsProps {
  posts: any[];
}

export function AdminNews({ posts }: AdminNewsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button className="px-4 py-1.5 bg-slate-800 text-white rounded-md text-sm font-medium shadow-sm">
            All Posts
          </button>
          <button className="px-4 py-1.5 text-slate-400 hover:text-white text-sm font-medium transition-colors">
            Published
          </button>
          <button className="px-4 py-1.5 text-slate-400 hover:text-white text-sm font-medium transition-colors">
            Drafts
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white">
            <Filter size={16} className="mr-2" /> Filter
          </Button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950/50 text-xs uppercase text-slate-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Article</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                        {post.featuredImage ? (
                          <img src={post.featuredImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600">
                            <FileText size={20} />
                          </div>
                        )}
                      </div>
                      <div className="max-w-xs">
                        <h4 className="text-white font-medium truncate">{post.title}</h4>
                        <p className="text-slate-500 text-xs mt-1 truncate">
                          {post.content?.replace(/<[^>]*>/g, "").substring(0, 40)}...
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {post.category || "News"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white font-bold">
                        {post.author?.name?.[0] || "U"}
                      </div>
                      <span className="text-slate-300 text-sm">{post.author?.name || "Unknown"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                          <MoreVertical size={18} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
                        <Link href={`/posts/${post.id}`}>
                          <DropdownMenuItem className="hover:bg-slate-800 focus:bg-slate-800 cursor-pointer">
                            <Eye size={16} className="mr-2" /> View
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/posts/${post.id}/edit`}>
                          <DropdownMenuItem className="hover:bg-slate-800 focus:bg-slate-800 cursor-pointer">
                            <Edit size={16} className="mr-2" /> Edit
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem className="text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer">
                          <Trash2 size={16} className="mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
