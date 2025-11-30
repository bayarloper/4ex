import { Metadata } from "next";
import ReadOnlyEditor from "@/components/tiptap-templates/simple/read-only-editor";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { auth } from "@/lib/auth";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      title: true,
      content: true,
      featuredImage: true,
    },
  });

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  // Strip HTML tags and truncate for description
  const description = post.content
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 160);

  return {
    title: post.title,
    description: description,
    openGraph: {
      title: post.title,
      description: description,
      images: post.featuredImage ? [{ url: post.featuredImage }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: description,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!id) return <div>Invalid post ID</div>;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          name: true,
          role: true,
        }
      }
    }
  });
  if (!post) notFound();

  // Check if user should see limited content
  const isFreeUser = !session || session.user.role === "FREE";
  const isAdmin = session?.user.role === "ADMIN";
  const shouldShowPreview = isFreeUser && !isAdmin;
  
  // Create preview content (first ~300 characters)
  let previewContent = post.content;
  if (shouldShowPreview) {
    const tempDiv = { innerHTML: post.content };
    const text = post.content.replace(/<[^>]*>/g, '');
    const previewText = text.substring(0, 300);
    // Simple content truncation
    const paragraphs = post.content.split('</p>');
    previewContent = paragraphs.slice(0, 2).join('</p>') + '</p>';
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <Link href="/posts">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              ← Буцах
            </Button>
          </Link>
        </div>

        <article className="bg-card border border-border rounded-xl p-6 sm:p-10 relative shadow-sm">
          {post.featuredImage && (
            <div className="relative h-64 sm:h-96 w-full mb-8 rounded-lg overflow-hidden bg-muted">
              <Image 
                src={post.featuredImage} 
                alt={post.title} 
                fill 
                className="object-cover"
              />
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
            <span className="flex items-center gap-1">
              <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                {post.author?.name?.[0] || "A"}
              </span>
              {post.author?.name || "Anonymous"}
            </span>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString(undefined, { dateStyle: "long" })}</span>
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
              <ReadOnlyEditor content={post.content} />
            </div>
          )}
        </article>
      </div>
    </>
  );
}
