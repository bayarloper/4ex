import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AdminOverview } from "@/components/admin/admin-overview";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch only what's needed for the overview
  const [users, posts] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        role: true,
      },
    }),
    prisma.post.findMany({
      select: {
        id: true,
        title: true,
        featuredImage: true,
        category: true,
        createdAt: true,
        content: true, // Needed for simple truncation in overview
      },
      orderBy: { createdAt: "desc" },
      take: 5, // Only get top 5 for overview
    }),
  ]);

  // Optimize posts payload
  const optimizedPosts = posts.map(post => ({
    ...post,
    content: post.content ? post.content.substring(0, 100) : "" // Minimal content for preview
  }));


  return (
    <div>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <AdminOverview users={users} posts={optimizedPosts} />
      </div>
    </div>
  );
}
