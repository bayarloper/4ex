import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { ArrowRight, Users, Shield } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { TermsSection } from "@/components/terms-section";
import { getFeaturedPosts, getTerms } from "@/lib/prisma-queries";
import dynamic from "next/dynamic";

// Lazy load the chart component
const HeroChart = dynamic(() => import("@/components/hero-visuals").then(mod => ({ default: mod.HeroChart })), {
  loading: () => <div className="h-96 bg-muted rounded-lg animate-pulse" />,
  ssr: true,
});

export const metadata = {
  title: "4EXPEDIA - ICT Trading Strategy",
  description: "Master the ICT Strategy and improve your trading skills",
};

export default async function Home() {
  const session = await auth();
  
  // Parallel data fetching
  const [posts, terms] = await Promise.all([
    getFeaturedPosts(6),
    getTerms(),
  ]);

  const termsData = terms.map(term => ({
    id: term.id,
    term: term.term,
    definition: term.definition,
    category: term.category,
    hasContent: !!term.content && term.content.length > 0
  }));

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
        <TermsSection terms={termsData} />

      </main>

      <Footer />
    </>
  );
}
