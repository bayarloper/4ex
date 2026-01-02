import prisma from "@/lib/prisma";

/**
 * Optimized queries to prevent N+1 and unnecessary data fetching
 */

// Standard author select fields to avoid repetition
const AUTHOR_SELECT = {
  id: true,
  name: true,
  email: true,
  image: true,
  role: true,
} as const;

/**
 * Get all posts with author info (optimized)
 */
export async function getPostsWithAuthors(
  take?: number,
  skip?: number,
) {
  return prisma.post.findMany({
    take,
    skip,
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: AUTHOR_SELECT,
      },
    },
  });
}

/**
 * Get single post by ID with author
 */
export async function getPostById(id: string) {
  return prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: AUTHOR_SELECT,
      },
    },
  });
}

/**
 * Get paginated posts (homepage)
 */
export async function getFeaturedPosts(
  limit: number = 6
) {
  return prisma.post.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      content: true,
      featuredImage: true,
      category: true,
      createdAt: true,
      author: {
        select: { name: true, image: true },
      },
    },
  });
}

/**
 * Get all terms (optimized)
 */
export async function getTerms() {
  return prisma.term.findMany({
    orderBy: { term: "asc" },
    select: {
      id: true,
      term: true,
      definition: true,
      category: true,
      content: true,
    },
  });
}

/**
 * Get terms for homepage (lightweight): avoids pulling full `content` blobs.
 * Returns the exact shape the homepage needs.
 */
export async function getTermsSummary() {
  const [terms, withContent] = await Promise.all([
    prisma.term.findMany({
      orderBy: { term: "asc" },
      select: {
        id: true,
        term: true,
        definition: true,
        category: true,
      },
    }),
    prisma.term.findMany({
      select: { id: true },
      where: {
        content: { not: null },
      },
    }),
  ])

  const contentIds = new Set(withContent.map((t) => t.id))

  return terms.map((t) => ({
    ...t,
    hasContent: contentIds.has(t.id),
  }))
}

/**
 * Get term by ID
 */
export async function getTermById(id: string) {
  return prisma.term.findUnique({
    where: { id },
  });
}

/**
 * Count total posts
 */
export async function countPosts() {
  return prisma.post.count();
}

/**
 * Count total users
 */
export async function countUsers() {
  return prisma.user.count();
}
