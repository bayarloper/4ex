"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, BookOpen, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Term } from "@/lib/generated/client/client";
import { cn } from "@/lib/utils";

interface TermsSectionProps {
  terms: Term[];
}

export function TermsSection({ terms }: TermsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Бүгд");

  // Get unique categories
  const categories = ["Бүгд", ...Array.from(new Set(terms.map(t => t.category)))];

  // Filter terms
  const filteredTerms = terms.filter(term => {
    const matchesSearch = 
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "Бүгд" || term.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Group for display if "Бүгд" is selected, otherwise just list
  const groupedTerms = filteredTerms.reduce((acc, term) => {
    if (!acc[term.category]) acc[term.category] = [];
    acc[term.category].push(term);
    return acc;
  }, {} as Record<string, Term[]>);

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide mb-4">
            <BookOpen size={14} />
            Мэдлэгийн сан
          </div>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Форекс ICT аргачлалын толь бичиг
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input 
              type="text" 
              placeholder="Түлхүүр үгээр хайх (жишээ: FVG, Order Block)..." 
              className="pl-10 h-12 text-lg bg-card/50 backdrop-blur-sm border-border/50 shadow-sm focus:ring-2 focus:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-105"
                  : "bg-card border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Terms Grid */}
        <div className="space-y-12">
          {Object.entries(groupedTerms).map(([category, categoryTerms]) => (
            <div key={category} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-1xl font-bold text-foreground mb-6 flex items-center gap-3">
                <span className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                {category}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categoryTerms.map((term) => (
                  <Link 
                    key={term.id} 
                    href={`/terms/${term.id}`}
                    className="group relative bg-card hover:bg-accent/50 border border-border hover:border-primary/30 rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-black text-sm text-primary tracking-tight">
                            {term.term}
                          </span>
                          {term.content && (
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" title="Дэлгэрэнгүй" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors line-clamp-2">
                          {term.definition}
                        </p>
                      </div>
                      <ArrowRight className="text-muted-foreground/30 group-hover:text-primary transition-colors transform group-hover:translate-x-1" size={20} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {filteredTerms.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Хайлтанд тохирох үг олдсонгүй.</p>
              <Button 
                variant="link" 
                onClick={() => {setSearchQuery(""); setSelectedCategory("Бүгд")}}
                className="mt-2"
              >
                Цэвэрлэх
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
