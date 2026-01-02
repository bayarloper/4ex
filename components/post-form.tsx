"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ModernEditor } from "@/components/tiptap-templates/simple/modern-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Editor } from "@tiptap/react";
import { UploadButton } from "@/lib/uploadthing";
import { X } from "lucide-react";
import Image from "next/image";

interface PostFormProps {
  initialData?: {
    id?: string;
    title: string;
    content: string;
    featuredImage?: string | null;
    category?: string;
  };
  isEditing?: boolean;
}

export function PostForm({ initialData, isEditing }: PostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [category, setCategory] = useState(initialData?.category || "Market Analysis");
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || "");
  const [editor, setEditor] = useState<Editor | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!editor) return;

    const contentText = editor.getText().trim();
    if (!title.trim() || contentText.length < 20) {
      setError("Title is required and content should be at least 20 characters.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const content = editor.getHTML();
      const url = isEditing ? `/api/posts/${initialData?.id}` : "/api/posts";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, featuredImage, category }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "Failed to save post");
        return;
      }

      router.push("/posts");
      router.refresh();
    } catch (error) {
      console.error("Failed to save post:", error);
      setError("Something went wrong while saving. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Featured Image</label>
          {featuredImage ? (
            <div className="relative w-full h-64 rounded-lg overflow-hidden border border-border group">
              <Image 
                src={featuredImage} 
                alt="Featured" 
                fill 
                className="object-cover"
              />
              <button
                onClick={() => setFeaturedImage("")}
                className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="w-full h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors">
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res?: Array<{ url: string }>) => {
                  const first = res?.[0];
                  if (first?.url) setFeaturedImage(first.url);
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
                appearance={{
                  button: "bg-primary text-primary-foreground hover:bg-primary/90",
                  allowedContent: "text-muted-foreground"
                }}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2 text-foreground">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title..."
              className="text-lg bg-background border-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-11 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="Market Analysis">Market Analysis</option>
              <option value="Education">Education</option>
              <option value="News">News</option>
              <option value="Signal">Signal</option>
              <option value="Strategy">Strategy</option>
            </select>
          </div>
        </div>
      </div>

      <div className="min-h-[500px]">
        <ModernEditor 
          onEditorReady={setEditor} 
          initialContent={initialData?.content || ""} 
        />
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert" aria-live="polite">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading || !title.trim() || !editor}>
          {loading ? "Saving..." : isEditing ? "Update Post" : "Create Post"}
        </Button>
      </div>
    </div>
  );
}
