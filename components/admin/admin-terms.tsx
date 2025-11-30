"use client";

import { useState, useMemo } from "react";
import { Term } from "@/lib/generated/client/client";
import { createTerm, deleteTerm, updateTerm, getTerm } from "@/app/actions/terms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit2, X, Save, Search, Filter, Loader2 } from "lucide-react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Editor } from "@tiptap/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminTermsProps {
  terms: Term[];
}

export function AdminTerms({ terms }: AdminTermsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(terms.map((t) => t.category));
    return ["All", ...Array.from(cats).sort()];
  }, [terms]);

  // Filter terms
  const filteredTerms = useMemo(() => {
    return terms.filter((term) => {
      const matchesSearch =
        term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || term.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [terms, searchTerm, selectedCategory]);

  // Group filtered terms
  const groupedTerms = useMemo(() => {
    return filteredTerms.reduce((acc, term) => {
      if (!acc[term.category]) {
        acc[term.category] = [];
      }
      acc[term.category].push(term);
      return acc;
    }, {} as Record<string, Term[]>);
  }, [filteredTerms]);

  const handleEditorReady = (editor: Editor) => {
    editor.on("update", () => {
      setEditorContent(editor.getHTML());
    });
  };

  const openAddModal = () => {
    setEditingTerm(null);
    setEditorContent("");
    setIsModalOpen(true);
  };

  const openEditModal = async (term: Term) => {
    setEditingTerm(term);
    setIsModalOpen(true);
    setIsLoadingContent(true);
    try {
      const fullTerm = await getTerm(term.id);
      if (fullTerm) {
        setEditorContent(fullTerm.content || "");
      }
    } catch (error) {
      console.error("Failed to fetch term content", error);
    } finally {
      setIsLoadingContent(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTerm(null);
    setEditorContent("");
    setIsLoadingContent(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-white">Terms Management</h3>
          <p className="text-sm text-slate-400">Manage your dictionary terms and definitions</p>
        </div>
        <Button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-500">
          <Plus size={18} className="mr-2" /> Add New Term
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input
            placeholder="Search terms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-900 border-slate-800 text-white"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800 hover:text-white min-w-[150px] justify-between">
              <span className="flex items-center gap-2">
                <Filter size={16} />
                {selectedCategory}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-slate-900 border-slate-800 text-slate-200 max-h-[300px] overflow-y-auto">
            {categories.map((cat) => (
              <DropdownMenuItem
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="hover:bg-slate-800 cursor-pointer focus:bg-slate-800 focus:text-white"
              >
                {cat}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Terms List */}
      <div className="grid gap-6">
        {Object.keys(groupedTerms).length === 0 ? (
          <div className="text-center py-12 bg-slate-900/30 rounded-xl border border-slate-800 border-dashed">
            <p className="text-slate-400">No terms found matching your criteria.</p>
          </div>
        ) : (
          Object.keys(groupedTerms).sort().map((category) => (
            <div key={category} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              <div className="bg-slate-800/50 px-6 py-3 border-b border-slate-800 flex justify-between items-center">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                  {category}
                </h4>
                <span className="text-xs text-slate-500 font-mono bg-slate-950 px-2 py-1 rounded">
                  {groupedTerms[category].length} terms
                </span>
              </div>
              <div className="divide-y divide-slate-800">
                {groupedTerms[category].map((term) => (
                  <div key={term.id} className="p-4 hover:bg-slate-800/30 transition-colors group">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold text-lg text-blue-400">{term.term}</span>
                          {term.content && (
                            <span className="text-[10px] uppercase tracking-wider text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20">
                              Has Content
                            </span>
                          )}
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">{term.definition}</p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openEditModal(term)}
                          className="h-8 w-8 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10"
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this term?")) {
                              deleteTerm(term.id);
                            }
                          }}
                          className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-400/10"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="sticky top-0 z-10 flex justify-between items-center p-6 bg-slate-900 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">
                {editingTerm ? "Edit Term" : "Add New Term"}
              </h2>
              <Button variant="ghost" size="icon" onClick={closeModal} className="text-slate-400 hover:text-white">
                <X size={20} />
              </Button>
            </div>
            
            <div className="p-6">
              <form
                action={async (formData) => {
                  if (editingTerm) {
                    await updateTerm(editingTerm.id, formData);
                  } else {
                    await createTerm(formData);
                  }
                  closeModal();
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Category</label>
                    <div className="relative">
                      <Input
                        name="category"
                        defaultValue={editingTerm?.category}
                        placeholder="e.g. GENERAL TERMS"
                        required
                        list="category-suggestions"
                        className="bg-slate-950 border-slate-800 text-white"
                      />
                      <datalist id="category-suggestions">
                        {categories.filter(c => c !== "All").map(c => (
                          <option key={c} value={c} />
                        ))}
                      </datalist>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Term (Acronym)</label>
                    <Input
                      name="term"
                      defaultValue={editingTerm?.term}
                      placeholder="e.g. SMC"
                      required
                      className="bg-slate-950 border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Definition</label>
                  <Textarea
                    name="definition"
                    defaultValue={editingTerm?.definition}
                    placeholder="Short definition of the term..."
                    required
                    className="bg-slate-950 border-slate-800 text-white min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Detailed Content (Optional)</label>
                  <div className="border border-slate-800 rounded-lg overflow-hidden min-h-[300px] bg-slate-950 relative">
                    {isLoadingContent ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 z-10">
                        <Loader2 className="animate-spin text-blue-500" size={32} />
                      </div>
                    ) : (
                      <SimpleEditor
                        onEditorReady={handleEditorReady}
                        initialContent={editorContent}
                      />
                    )}
                  </div>
                  <input type="hidden" name="content" value={editorContent} />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <Button type="button" variant="ghost" onClick={closeModal} className="text-slate-400 hover:text-white">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white">
                    {editingTerm ? "Save Changes" : "Create Term"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
