import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ArrowRight, Users, Shield } from "lucide-react";
import { HeroChart } from "@/components/hero-visuals";
import { PostCard } from "@/components/post-card";
import { Post } from "@/lib/generated/client/client";

import { TermsSection } from "@/components/terms-section";

export default async function Home() {
  const session = await auth();
  const posts = await prisma.post.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { name: true, image: true },
      },
    },
  });

  const terms = await prisma.term.findMany({
    orderBy: { term: 'asc' }
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative pt-12 pb-20 overflow-hidden bg-background">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611974765270-ca12586343bb?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-5"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight mb-6">
                Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-500">ICT</span> Strategy.
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                Та өөрийн арилжааны ур чадвараа сайжруулж, ICT аргачлалыг ашиглан зах зээлийг хэрхэн шинжлэх талаар суралцаарай.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/signup">
                  <button className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-xl shadow-blue-900/20 flex items-center gap-2">
                    Бүртгүүлэх <ArrowRight size={18} />
                  </button>
                </Link>
                <Link href="/posts">
                  <button className="px-8 py-3.5 bg-card hover:bg-accent text-foreground rounded-xl font-bold transition-all border border-border shadow-sm">
                    Нийтлэл
                  </button>
                </Link>
              </div>
              
              <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground font-medium">
                <div className="flex items-center gap-2">
                  <Users size={18} /> 100+ Гишүүд
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={18} /> Баталгаажсан эх сурвалж
                </div>
              </div>
            </div>

            <div className="relative">
              <HeroChart />
            </div>
          </div>
        </section>

        {/* Featured Posts Section */}
        <section className="py-20 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
                  Нийтлэл
                </h2>
              </div>
              <Link href="/posts">
                <Button
                  variant="outline"
                  className="hidden sm:inline-flex"
                >
                  Бусад
                </Button>
              </Link>
            </div>

            {posts.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {posts.map((post: Post & { author: { name: string | null; image: string | null } | null }) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">
                  Одоогоор нийтлэл байхгүй байна.
                </p>
                {session?.user.role === "ADMIN" && (
                  <Link href="/posts/new">
                    <Button
                      className="bg-gradient-to-r from-primary to-purple-600"
                    >
                      Нийтлэл бичих
                    </Button>
                  </Link>
                )}
              </div>
            )}

            <div className="flex sm:hidden justify-center mt-8">
              <Link href="/posts" className="w-full">
                <Button
                  variant="outline"
                  className="w-full"
                >
                  Бүх нийтлэл
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ICT Trading Checklist */}
        <TermsSection terms={terms} />

      </main>

      <Footer />
    </>
  );
}
