import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AdminDashboardClient } from "@/components/admin/admin-dashboard-client";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const [users, posts, terms] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        featuredImage: true,
        category: true,
        createdAt: true,
        author: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.term.findMany({
      orderBy: { term: "asc" },
      select: {
        id: true,
        term: true,
        definition: true,
        category: true,
        content: true, // Still need to know if content exists, but maybe we can select just a boolean? No, Prisma doesn't support that easily.
        // Actually, for the list view we show "Has Content" badge.
        // If content is huge, selecting it is bad.
        // But we can't select "length of content" easily.
        // Let's select it for now, but maybe we can optimize later if it's really slow.
        // Wait, I can select `content` but I will truncate it in the map below.
      },
    }),
  ]);

  // Optimize posts payload
  const optimizedPosts = posts.map(post => ({
    ...post,
    content: post.content.substring(0, 200)
  }));

  // Optimize terms payload - remove content string to save bandwidth
  const optimizedTerms = terms.map(term => ({
    ...term,
    content: term.content ? "..." : null, // Just a marker that it exists
    hasContent: !!term.content && term.content.length > 0
  }));

  return <AdminDashboardClient users={users} posts={optimizedPosts} terms={optimizedTerms} />;
}
