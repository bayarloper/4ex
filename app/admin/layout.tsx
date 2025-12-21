import Link from "next/link";
import { LayoutDashboard, Users, FileText, LogOut, PlusCircle } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                            4EX
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-none">Admin Panel</h1>
                            <p className="text-xs text-slate-400 mt-1">Dashboard</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-slate-400 hover:bg-slate-800 hover:text-slate-200 focus:bg-slate-800 focus:text-white">
                            <LayoutDashboard size={20} />
                            <span className="font-medium">Overview</span>
                        </button>
                    </Link>

                    <Link href="/admin/users">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-slate-400 hover:bg-slate-800 hover:text-slate-200 focus:bg-slate-800 focus:text-white">
                            <Users size={20} />
                            <span className="font-medium">Manage Users</span>
                        </button>
                    </Link>

                    <Link href="/admin/news">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-slate-400 hover:bg-slate-800 hover:text-slate-200 focus:bg-slate-800 focus:text-white">
                            <FileText size={20} />
                            <span className="font-medium">News & Courses</span>
                        </button>
                    </Link>

                    <Link href="/admin/terms">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-slate-400 hover:bg-slate-800 hover:text-slate-200 focus:bg-slate-800 focus:text-white">
                            <FileText size={20} />
                            <span className="font-medium">Terms & Glossary</span>
                        </button>
                    </Link>

                    <div className="pt-4 mt-4 border-t border-slate-800">
                        <Link href="/posts/new">
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-blue-400 transition-all group">
                                <PlusCircle size={20} className="group-hover:text-blue-400" />
                                <span className="font-medium">Create New Post</span>
                            </button>
                        </Link>
                    </div>
                </nav>

                <div className="p-4 border-t border-slate-800 space-y-2">
                    <Link href="/">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all">
                            <LogOut size={20} />
                            <span className="font-medium">Exit Admin</span>
                        </button>
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
