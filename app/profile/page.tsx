import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ProfileView } from "@/components/profile-view";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin?callbackUrl=/profile");
  }

  const { user } = session;
  const joinDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Fetch only what we display (avoid extra query work)
  const postsCreated = await prisma.post.count({
    where: { authorId: user.id },
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <ProfileView
          user={user}
          stats={{ postsCount: postsCreated, joinDate }}
        />
      </main>
      <Footer />
    </>
  );
}
