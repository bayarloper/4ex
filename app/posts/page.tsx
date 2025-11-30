import Link from "next/link";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { auth } from "@/lib/auth";
import { PostCard } from "@/components/post-card";
import { SearchBar } from "@/components/search-bar";

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;
  const session = await auth();
  
  const posts = await prisma.post.findMany({
    where: query ? {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
      ],
    } : undefined,
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Header Section */}
        <section className="bg-primary/5 py-12 sm:py-16 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


            {/* Search Bar */}
            <SearchBar placeholder="Search articles..." />
          </div>
        </section>

        {/* Posts Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center gap-2 mt-12">
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      page === 1
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {query ? "No articles found" : "No articles yet"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {query ? `We couldn't find any articles matching "${query}"` : "Check back soon for exciting content from our community."}
              </p>
              {session?.user?.role === "ADMIN" && (
                <Link href="/">
                  <Button className="bg-primary text-primary-foreground">
                    Create First Article
                  </Button>
                </Link>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
