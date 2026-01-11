import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AdminTerms } from "@/components/admin/admin-terms";
import { Search, Bell } from "lucide-react";

export default async function AdminTermsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
        redirect("/");
    }

    const params = await searchParams;
    const search = (params.search as string) || "";

    // Note: Client component AdminTerms handles complex grouping/filtering, 
    // so we might want to fetch all or a larger chunk, OR refactor AdminTerms to be simpler.
    // For now, let's fetch more items to support the client-side grouping, but still limit it to avoid crashing.
    // Ideally, the grouping logic should move to the server or be handled differently.
    // Given the current implementation of AdminTerms expects all terms to group them, 
    // we will fetch a larger set (e.g. 500) but warn about it or plan to refactor AdminTerms later.
    // Refactoring AdminTerms to be server-side grouped is a larger task.
    // Let's implement searching here to filter down the result set.

    const take = 500;

    const where = search
        ? {
            OR: [
                { term: { contains: search, mode: 'insensitive' as const } },
                { definition: { contains: search, mode: 'insensitive' as const } },
            ],
        }
        : {};

    const terms = await prisma.term.findMany({
        where,
        orderBy: { term: "asc" },
        take,
        select: {
            id: true,
            term: true,
            definition: true,
            category: true,
            content: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return (
        <div>
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Terms & Glossary</h2>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <form action="">
                            <input
                                type="text"
                                name="search"
                                defaultValue={search}
                                placeholder="Search terms..."
                                className="bg-slate-900 border border-slate-800 text-slate-200 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 w-64"
                            />
                        </form>
                    </div>
                    <button className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors relative">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <AdminTerms terms={terms} />
            </div>
        </div>
    );
}
