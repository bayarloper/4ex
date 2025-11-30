import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { z } from "zod"

const updatePostSchema = z.object({
  title: z.string().min(1, "Title is required").max(100).optional(),
  content: z.string().min(1, "Content is required").optional(),
  featuredImage: z.string().optional(),
  category: z.string().optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()

  if (!session || !session.user || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { title, content, featuredImage, category } = updatePostSchema.parse(body)

    const post = await prisma.post.update({
      where: { id },
      data: { title, content, featuredImage, category },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error updating post:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()

  if (!session || !session.user || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    await prisma.post.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Post deleted" })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
