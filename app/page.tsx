import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { ArrowRight, Users, Shield, Send, Globe } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { TermsSection } from "@/components/terms-section";
import { getFeaturedPosts, getTermsSummary } from "@/lib/prisma-queries";
import { HeroChart } from "@/components/hero-visuals";

export const metadata = {
  title: "4EXPEDIA - ICT Trading Strategy",
  description: "Master the ICT Strategy and improve your trading skills",
};

export default async function Home() {
  const session = await auth();
  
  // Parallel data fetching
  const [posts, terms] = await Promise.all([
    getFeaturedPosts(6),
    getTermsSummary(),
  ]);

  const termsData = terms;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative pt-12 pb-20 overflow-hidden bg-background">
          {/* Avoid remote hero background images (extra request + can delay LCP) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#3b82f61a,transparent_55%),radial-gradient(circle_at_bottom,#10b9811a,transparent_55%)]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight mb-6 animate-fade-in-up text-balance">
                Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-500">ICT</span> Strategy.
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed animate-fade-in-up delay-100 text-balance">
                Та өөрийн арилжааны ур чадвараа сайжруулж, ICT аргачлалыг ашиглан зах зээлийг хэрхэн шинжлэх талаар суралцаарай.
              </p>

              <div className="flex flex-wrap gap-4 animate-fade-in-up delay-200">
                {!session ? (
                  <Link href="/signup">
                    <Button variant="premium" size="lg" className="rounded-xl font-bold flex items-center gap-2">
                      Бүртгүүлэх <ArrowRight size={18} />
                    </Button>
                  </Link>
                ) : session.user.role === "FREE" ? (
                  <Link href="/membership">
                    <Button variant="premium" size="lg" className="rounded-xl font-bold flex items-center gap-2">
                      Гишүүн болох <ArrowRight size={18} />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/profile">
                    <Button variant="premium" size="lg" className="rounded-xl font-bold flex items-center gap-2">
                      Профайл <ArrowRight size={18} />
                    </Button>
                  </Link>
                )}
                <Link href="/posts">
                  <Button variant="outline" size="lg" className="rounded-xl font-bold border-border shadow-sm">
                    Нийтлэл
                  </Button>
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground font-medium animate-fade-in-up delay-300">
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

        {/* Community Section (below hero) */}
        <section className="py-12 bg-muted/30 border-y border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden">
              <div className="relative z-10 grid gap-6 md:grid-cols-[1.2fr_0.8fr] items-start">
                <div>
                  <p className="text-muted-foreground text-xs font-bold tracking-wider">
                    Санал болгож буй
                  </p>
                  <h2 id="community-title" className="text-2xl md:text-3xl font-extrabold text-foreground mt-1 leading-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-500">
                      Maru
                    </span>{" "}
                    Community
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    Бид зөвхөн арилжаа хийдэггүй — бид хамтдаа хөгждөг.
                  </p>

                  <p className="text-sm text-muted-foreground leading-relaxed mt-4">
                    ICT аргачлалаар арилжааг эхнээс нь сурах бол танд дараах community-г санал болгож байна.
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-3">
                    <Button
                      asChild
                      variant="premium"
                      size="lg"
                      className="rounded-xl font-bold w-full sm:w-auto gap-2"
                    >
                      <Link
                        href="https://t.me/Marugroupchat"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Send className="h-[18px] w-[18px]" />
                        Telegram
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="rounded-xl font-bold w-full sm:w-auto bg-background/40 hover:bg-accent/60 gap-2"
                    >
                      <Link
                        href="https://maru.mn"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="h-[18px] w-[18px]" />
                        Maru.mn
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-3">
                  <div className="rounded-xl border border-border/50 bg-background/40 backdrop-blur-sm p-3">
                    <p className="text-[10px] text-muted-foreground font-bold tracking-widest">
                      COMMUNITY
                    </p>
                    <p className="text-sm font-semibold text-foreground mt-1">
                      Skool Platform
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/50 bg-background/40 backdrop-blur-sm p-3">
                    <p className="text-[10px] text-muted-foreground font-bold tracking-widest">
                      LEARN
                    </p>
                    <p className="text-sm font-semibold text-foreground mt-1">
                      Алхам алхмаар
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/50 bg-background/40 backdrop-blur-sm p-3">
                    <p className="text-[10px] text-muted-foreground font-bold tracking-widest">
                      Q&amp;A
                    </p>
                    <p className="text-sm font-semibold text-foreground mt-1">
                      Асуулт хариулт
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Posts Section */}
        <section className="py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
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
        <TermsSection terms={termsData} className="bg-muted/30 border-t border-border/50" />

      </main>

      <Footer />
    </>
  );
}
