"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { Post, User } from "@/lib/generated/client/client";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    featuredImage: string | null;
    category: string;
    createdAt: Date;
    author: { name: string | null; image: string | null } | null;
  };
}

export function PostCard({ post }: PostCardProps) {
  // Format date
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Strip HTML for summary
  const summary = post.content.replace(/<[^>]*>/g, "").substring(0, 120) + "...";

  return (
    <Link href={`/posts/${post.id}`} className="block h-full group">
      <div className="relative bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/50 hover:border-blue-500/50 transition-all duration-300 flex flex-col h-full shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative h-52 overflow-hidden bg-muted">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted/50 text-muted-foreground">
              <span className="text-sm">Зураг олдсонгүй</span>
            </div>
          )}

          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2.5 py-1 bg-background/90 text-[10px] font-bold rounded-lg backdrop-blur-md text-foreground uppercase tracking-wider border border-border/50 shadow-sm">
              {post.category}
            </span>
          </div>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center gap-3 text-muted-foreground text-xs font-medium mb-3">
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-blue-500" />
              <span>{formattedDate}</span>
            </div>
            {post.author?.name && (
              <>
                <span className="w-1 h-1 rounded-full bg-border"></span>
                <span className="flex items-center gap-1">
                  {post.author.image && (
                    <Image src={post.author.image} alt={post.author.name} width={16} height={16} className="rounded-full" />
                  )}
                  {post.author.name.split(' ')[0]}
                </span>
              </>
            )}
          </div>

          <h3 className="text-lg font-bold text-foreground mb-3 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {post.title}
          </h3>

          <p className="text-muted-foreground text-sm line-clamp-3 mb-5 flex-grow leading-relaxed">
            {summary}
          </p>

          <div className="mt-auto pt-4 border-t border-border/50">
            <div className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all text-center flex items-center justify-center gap-2 ${'bg-accent/50 text-foreground group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-600'
              }`}>
              Дэлгэрэнгүй
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
