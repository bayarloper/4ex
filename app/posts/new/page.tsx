import { Navbar } from "@/components/navbar";
import { PostForm } from "@/components/post-form";
import { Footer } from "@/components/footer";

export default function CreatePostPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold mb-8 text-foreground">Create New Post</h1>
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <PostForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
