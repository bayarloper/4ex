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
    <Link href={`/posts/${post.id}`} className="block h-full">
      <div className="group relative bg-card rounded-xl overflow-hidden border border-border hover:border-blue-500 transition-all duration-300 flex flex-col h-full shadow-lg hover:shadow-blue-900/20">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden bg-muted">
          {post.featuredImage ? (
            <Image 
              src={post.featuredImage} 
              alt={post.title} 
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
              Зураг олдсонгүй
            </div>
          )}
          
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2 py-1 bg-background/80 text-xs font-semibold rounded backdrop-blur-sm text-foreground uppercase tracking-wide border border-border/50">
              {post.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-3">
            <Clock size={14} />
            <span>{formattedDate}</span>
            {post.author?.name && (
              <>
                <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                <span>{post.author.name}</span>
              </>
            )}
          </div>
          
          <h3 className="text-lg font-bold text-card-foreground mb-2 leading-tight group-hover:text-blue-500 transition-colors">
            {post.title}
          </h3>
          
          <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
            {summary}
          </p>

          <div className="mt-auto">
            <div className={`w-full py-2 rounded-lg font-medium text-sm transition-colors text-center ${
                'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}>
              {'Дэлгэрэнгүй'}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
