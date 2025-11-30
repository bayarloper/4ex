import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ArrowRight, Users, Shield } from "lucide-react";
import { HeroChart, AiInsight } from "@/components/hero-visuals";
import { PostCard } from "@/components/post-card";

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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-semibold uppercase tracking-wide mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Live Market Data
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight mb-6">
                Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-500">Forex</span> Markets.
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                Get premium signals, expert courses, and real-time AI analysis. Join 4ex.mn to elevate your trading strategy today.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/signup">
                  <button className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-xl shadow-blue-900/20 flex items-center gap-2">
                    Get Started Free <ArrowRight size={18} />
                  </button>
                </Link>
                <Link href="/posts">
                  <button className="px-8 py-3.5 bg-card hover:bg-accent text-foreground rounded-xl font-bold transition-all border border-border shadow-sm">
                    View Courses
                  </button>
                </Link>
              </div>
              
              <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground font-medium">
                <div className="flex items-center gap-2">
                  <Users size={18} /> 10k+ Traders
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={18} /> Verified Data
                </div>
              </div>
            </div>

            <div className="relative">
              <HeroChart />
              <div className="absolute -bottom-6 -right-6 md:-left-6 md:bottom-10 md:w-80">
                <AiInsight />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Posts Section */}
        <section className="py-20 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
                  Шинэ нийтлэлүүд
                </h2>
                <p className="text-muted-foreground">
                  Манай нийгэмлэгийн хамгийн сүүлийн үеийн түүхүүдийг нээн илрүүлээрэй
                </p>
              </div>
              <Link href="/posts">
                <Button
                  variant="outline"
                  className="hidden sm:inline-flex"
                >
                  View All
                </Button>
              </Link>
            </div>

            {posts.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {posts.map((post) => (
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
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              4EXPedia
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              ICT арилжааны аргачлалыг сурахад шаардлагатай гол аргачлалуудыг эндээс олж авна уу.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Easy Publishing",
              },
              {
                title: "Easy Publishing",
              },
              {
                title: "Easy Publishing",
              },
              {
                title: "Easy Publishing",
              },
              {
                title: "Easy Publishing",
              },
              {
                title: "Easy Publishing",
              },
            ].map((feature, idx) => {
              return (
                <div
                  key={idx}
                  className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition shadow-sm hover:shadow-md"
                >
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
