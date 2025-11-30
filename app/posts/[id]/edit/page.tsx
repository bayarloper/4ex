import { Navbar } from "@/components/navbar";
import { PostForm } from "@/components/post-form";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) notFound();

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
        <PostForm 
          initialData={{
            id: post.id,
            title: post.title,
            content: post.content,
            featuredImage: post.featuredImage,
            category: post.category,
          }}
          isEditing
        />
      </div>
    </>
  );
}
