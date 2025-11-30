import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { z } from "zod"

const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  content: z.string().min(1, "Content is required"),
  featuredImage: z.string().optional(),
  category: z.string().optional(),
})

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        }
      }
    }
  })
  return NextResponse.json(posts)
}

export async function POST(request: Request) {
  const session = await auth()
  
  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Only Admins can create posts" },
      { status: 403 }
    )
  }

  try {
    const body = await request.json()
    const { title, content, featuredImage, category } = createPostSchema.parse(body)

    const post = await prisma.post.create({
      data: { 
        title, 
        content,
        featuredImage,
        category: category || "Market Analysis",
        authorId: session.user.id
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        }
      }
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error creating post:", error);
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