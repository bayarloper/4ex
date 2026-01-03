
import { Metadata } from "next";
import ReadOnlyEditor from "@/components/tiptap-templates/simple/read-only-editor";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { auth } from "@/lib/auth";

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function previewHtml(html: string, paragraphCount: number, textFallbackChars: number) {
  const trimmed = (html ?? "").trim();
  if (!trimmed) return "";

  // Prefer grabbing the first N paragraphs if the content is HTML-ish.
  const paragraphs = trimmed.match(/<p[\s\S]*?<\/p>/gi);
  if (paragraphs && paragraphs.length) {
    return paragraphs.slice(0, paragraphCount).join("");
  }

  // Fallback: strip tags, truncate plain text, wrap as a paragraph.
  const text = trimmed.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  const short = text.substring(0, textFallbackChars);
  return `<p>${escapeHtml(short)}${text.length > short.length ? "…" : ""}</p>`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const term = await prisma.term.findUnique({
    where: { id },
  });

  if (!term) {
    return {
      title: "Term not found",
    };
  }

  const description = (term.definition || term.content || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 160);

  return {
    title: `${term.term} - 4EX.MN`,
    description: description,
    openGraph: {
      title: `${term.term} - 4EX.MN`,
      description: description,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: `${term.term} - 4EX.MN`,
      description: description,
    },
  };
}

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
  const shouldGateContent = isFreeUser && !isAdmin && !!term.content;
  
  // Content handling:
  // - If term has rich `content`, that is the full article
  // - If not, the definition is the full content (and should NOT be gated)
  const fullHtml = term.content?.trim()
    ? term.content
    : `<p>${escapeHtml(term.definition ?? "")}</p>`;

  const previewContent = previewHtml(fullHtml, 2, 320);

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
          
          {shouldGateContent ? (
            <>
              <div className="prose max-w-none dark:prose-invert">
                <ReadOnlyEditor content={previewContent} className="compact" />
              </div>
              
              <div className="mt-4 text-center border-t border-border pt-4">
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
              <ReadOnlyEditor content={fullHtml} />
            </div>
          )}
        </article>
      </div>
    </>
  );
}
