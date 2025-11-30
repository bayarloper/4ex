import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ProfileView } from "@/components/profile-view";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <Lock className="mx-auto mb-4 text-muted-foreground" size={48} />
            <p className="text-lg text-muted-foreground mb-4">
              Please sign in to view your profile
            </p>
            <Link href="/signin">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const { user } = session;
  const joinDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Fetch user stats and posts
  const [postsCreated, userPosts] = await Promise.all([
    prisma.post.count({
      where: { authorId: user.id },
    }),
    prisma.post.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <ProfileView 
          user={user} 
          stats={{ postsCount: postsCreated, joinDate }} 
          posts={userPosts} 
        />
      </main>
      <Footer />
    </>
  );
}
