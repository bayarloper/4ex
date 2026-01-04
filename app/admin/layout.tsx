import Link from "next/link";
import { LayoutDashboard, Users, FileText, LogOut, PlusCircle } from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect("/signin?callbackUrl=/admin");
    }

    if (session.user.role !== "ADMIN") {
        redirect("/");
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-border flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                            4EX
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-none">Admin Panel</h1>
                            <p className="text-xs text-muted-foreground mt-1">Dashboard</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        href="/admin"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Overview</span>
                    </Link>

                    <Link
                        href="/admin/users"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <Users size={20} />
                        <span className="font-medium">Manage Users</span>
                    </Link>

                    <Link
                        href="/admin/news"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <FileText size={20} />
                        <span className="font-medium">News & Courses</span>
                    </Link>

                    <Link
                        href="/admin/terms"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <FileText size={20} />
                        <span className="font-medium">Terms & Glossary</span>
                    </Link>

                    <div className="pt-4 mt-4 border-t border-border">
                        <Link
                            href="/posts/new"
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-border text-muted-foreground hover:bg-accent hover:text-primary transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <PlusCircle size={20} className="group-hover:text-primary" />
                            <span className="font-medium">Create New Post</span>
                        </Link>
                    </div>
                </nav>

                <div className="p-4 border-t border-border space-y-2">
                    <Link
                        href="/"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Exit Admin</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
