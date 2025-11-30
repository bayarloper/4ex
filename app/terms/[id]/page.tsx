
import ReadOnlyEditor from "@/components/tiptap-templates/simple/read-only-editor";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { auth } from "@/lib/auth";

export default async function TermPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!id) return <div>Invalid term ID</div>;

  const term = await prisma.term.findUnique({
    where: { id },
  });
  if (!term) notFound();

  // Check if user should see limited content
  const isFreeUser = !session || session.user.role === "FREE";
  const isAdmin = session?.user.role === "ADMIN";
  const shouldShowPreview = isFreeUser && !isAdmin;
  
  // Content handling
  const content = term.content || term.definition; // Fallback to definition if no content
  
  // Create preview content (first ~300 characters)
  let previewContent = content;
  if (shouldShowPreview) {
    const tempDiv = { innerHTML: content };
    const text = content.replace(/<[^>]*>/g, '');
    const previewText = text.substring(0, 300);
    // Simple content truncation
    const paragraphs = content.split('</p>');
    previewContent = paragraphs.slice(0, 2).join('</p>') + '</p>';
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              ← Буцах
            </Button>
          </Link>
        </div>

        <article className="bg-card border border-border rounded-xl p-6 sm:p-10 relative shadow-sm">
          <div className="mb-8 pb-8 border-b border-border">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide mb-4">
              {term.category}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              {term.term}: {term.definition}
            </h1>
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date(term.updatedAt).toLocaleDateString(undefined, { dateStyle: "long" })}
            </div>
          </div>
          
          {shouldShowPreview ? (
            <>
              <div className="relative">
                <div className="prose max-w-none dark:prose-invert">
                  <ReadOnlyEditor content={previewContent} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-card via-card/90 to-transparent" />
              </div>
              
              <div className="mt-8 text-center border-t border-border pt-8">
                <div className="bg-muted/50 rounded-xl border border-border p-8 max-w-md mx-auto shadow-sm">
                  <h3 className="text-xl font-bold mb-2 text-foreground">🔒 Гишүүдэд зориулсан контент</h3>
                  <p className="text-muted-foreground mb-6">
                    {session ? 
                      "Төлбөртэй гишүүд нийтлэлийн бүрэн хувилбарыг унших боломжтой." :
                      "Төлбөртэй гишүүд нийтлэлийн бүрэн хувилбарыг унших боломжтой."
                    }
                  </p>
                  {session ? (
                    <p className="text-sm text-muted-foreground">
                      Админтай холбогдож, өөрийн эрхийн түвшинг нэмүүлнэ үү.
                    </p>
                  ) : (
                    <div className="flex gap-3 justify-center">
                      <Link href="/signin">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Нэвтрэх</Button>
                      </Link>
                      <Link href="/signup">
                        <Button variant="outline">Бүртгүүлэх</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="prose max-w-none dark:prose-invert">
              <ReadOnlyEditor content={content} />
            </div>
          )}
        </article>
      </div>
    </>
  );
}
