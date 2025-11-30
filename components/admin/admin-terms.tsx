"use client";

import { useState } from "react";
import { Term } from "@/lib/generated/client/client";
import { createTerm, deleteTerm, updateTerm } from "@/app/actions/terms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit2, X, Save } from "lucide-react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Editor } from "@tiptap/react";

interface AdminTermsProps {
  terms: Term[];
}

export function AdminTerms({ terms }: AdminTermsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addContent, setAddContent] = useState("");
  const [editContent, setEditContent] = useState("");

  const handleAddEditorReady = (editor: Editor) => {
    editor.on('update', () => {
      setAddContent(editor.getHTML());
    });
  };

  const handleEditEditorReady = (editor: Editor) => {
    editor.on('update', () => {
      setEditContent(editor.getHTML());
    });
  };

  // Group terms for display
  const groupedTerms = terms.reduce((acc, term) => {
    if (!acc[term.category]) {
      acc[term.category] = [];
    }
    acc[term.category].push(term);
    return acc;
  }, {} as Record<string, Term[]>);

  const categories = Object.keys(groupedTerms).sort();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Terms Management</h3>
        <Button onClick={() => setIsAdding(!isAdding)} className="bg-blue-600 hover:bg-blue-500">
          <Plus size={18} className="mr-2" /> Add New Term
        </Button>
      </div>

      {isAdding && (
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 mb-6">
          <h4 className="text-lg font-semibold mb-4 text-white">Add New Term</h4>
          <form action={async (formData) => {
            await createTerm(formData);
            setIsAdding(false);
          }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                <Input name="category" placeholder="e.g. GENERAL TERMS" required className="bg-slate-950 border-slate-800 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Term (Acronym)</label>
                <Input name="term" placeholder="e.g. SMC" required className="bg-slate-950 border-slate-800 text-white" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Definition</label>
              <Textarea name="definition" placeholder="e.g. Smart Money Concepts" required className="bg-slate-950 border-slate-800 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Content</label>
              <div className="border border-slate-800 rounded-lg overflow-hidden min-h-[300px] bg-slate-950">
                <SimpleEditor 
                  onEditorReady={handleAddEditorReady}
                  initialContent=""
                />
              </div>
              <input type="hidden" name="content" value={addContent} />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white">Cancel</Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-500">Save Term</Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6">
        {categories.map((category) => (
          <div key={category} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="bg-slate-800/50 px-6 py-3 border-b border-slate-800">
              <h4 className="font-bold text-white">{category}</h4>
            </div>
            <div className="divide-y divide-slate-800">
              {groupedTerms[category].map((term) => (
                <div key={term.id} className="p-4 hover:bg-slate-800/30 transition-colors">
                  {editingId === term.id ? (
                    <form action={async (formData) => {
                      await updateTerm(term.id, formData);
                      setEditingId(null);
                      setEditContent("");
                    }} className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Input name="category" defaultValue={term.category} required className="bg-slate-950 border-slate-800 text-white" />
                          <Input name="term" defaultValue={term.term} required className="bg-slate-950 border-slate-800 text-white" />
                          <Input name="definition" defaultValue={term.definition} required className="bg-slate-950 border-slate-800 text-white" />
                        </div>
                        <div className="border border-slate-800 rounded-lg overflow-hidden min-h-[300px] bg-slate-950">
                          <SimpleEditor 
                            onEditorReady={handleEditEditorReady}
                            initialContent={term.content || ""}
                          />
                        </div>
                        <input type="hidden" name="content" value={editContent || term.content || ""} />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                        <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-500"><Save size={14} className="mr-1" /> Save</Button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-400">{term.term}</span>
                          <span className="text-slate-500 text-xs px-2 py-0.5 bg-slate-800 rounded-full">{term.category}</span>
                        </div>
                        <p className="text-slate-300 mt-1">{term.definition}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => {
                          setEditingId(term.id);
                          setEditContent(term.content || "");
                        }} className="text-slate-400 hover:text-blue-400">
                          <Edit2 size={16} />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => deleteTerm(term.id)} className="text-slate-400 hover:text-red-400">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
