import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AdminNews } from "@/components/admin/admin-news";
import { Search, Bell, PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function AdminNewsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
        redirect("/");
    }

    const params = await searchParams;
    const page = Number(params.page) || 1;
    const search = (params.search as string) || "";

    const take = 10;
    const skip = (page - 1) * take;

    const where = search
        ? {
            title: { contains: search, mode: 'insensitive' as const },
        }
        : {};

    const [posts, total] = await Promise.all([
        prisma.post.findMany({
            where,
            select: {
                id: true,
                title: true,
                content: true,
                featuredImage: true,
                category: true,
                createdAt: true,
                author: {
                    select: { name: true },
                },
            },
            orderBy: { createdAt: "desc" },
            take,
            skip,
        }),
        prisma.post.count({ where }),
    ]);

    const optimizedPosts = posts.map(post => ({
        ...post,
        content: post.content ? post.content.substring(0, 200) : ""
    }));

    const totalPages = Math.ceil(total / take);

    return (
        <div>
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">News & Courses</h2>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <form action="">
                            <input
                                type="text"
                                name="search"
                                defaultValue={search}
                                placeholder="Search posts..."
                                className="bg-slate-900 border border-slate-800 text-slate-200 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 w-64"
                            />
                        </form>
                    </div>
                    <Link href="/posts/new">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium text-sm">
                            <PlusCircle size={18} />
                            Create Post
                        </button>
                    </Link>
                    <button className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors relative">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <AdminNews posts={optimizedPosts} />

                {/* Simple Pagination */}
                <div className="flex items-center justify-between mt-6">
                    <span className="text-sm text-slate-400">
                        Showing {Math.min(skip + 1, total)} to {Math.min(skip + take, total)} of {total} posts
                    </span>
                    <div className="flex gap-2">
                        {page > 1 && (
                            <a href={`?page=${page - 1}${search ? `&search=${search}` : ''}`} className="px-3 py-1 bg-slate-800 rounded hover:bg-slate-700 text-sm">Previous</a>
                        )}
                        {page < totalPages && (
                            <a href={`?page=${page + 1}${search ? `&search=${search}` : ''}`} className="px-3 py-1 bg-slate-800 rounded hover:bg-slate-700 text-sm">Next</a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
