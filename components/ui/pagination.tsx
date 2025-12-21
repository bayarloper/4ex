"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
    totalPages: number;
    className?: string;
}

export function Pagination({ totalPages, className }: PaginationProps) {
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNumber.toString());
        return `?${params.toString()}`;
    };

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <Button
                variant="outline"
                size="icon"
                asChild
                disabled={currentPage <= 1}
                className="h-8 w-8 bg-slate-900 border-slate-800 text-slate-400 hover:text-white disabled:opacity-50"
            >
                {currentPage <= 1 ? (
                    <span aria-disabled="true">
                        <ChevronLeft className="h-4 w-4" />
                    </span>
                ) : (
                    <Link href={createPageURL(currentPage - 1)}>
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                )}
            </Button>

            <div className="text-sm text-slate-400">
                Page <span className="font-medium text-white">{currentPage}</span> of{" "}
                <span className="font-medium text-white">{totalPages}</span>
            </div>

            <Button
                variant="outline"
                size="icon"
                asChild
                disabled={currentPage >= totalPages}
                className="h-8 w-8 bg-slate-900 border-slate-800 text-slate-400 hover:text-white disabled:opacity-50"
            >
                {currentPage >= totalPages ? (
                    <span aria-disabled="true">
                        <ChevronRight className="h-4 w-4" />
                    </span>
                ) : (
                    <Link href={createPageURL(currentPage + 1)}>
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                )}
            </Button>
        </div>
    );
}
