"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { uploadFiles } from "@/lib/uploadthing";
import throttle from "lodash.throttle";
import { Loader2 } from "lucide-react";
import type { ClientUploadedFileData } from "uploadthing/types";

type QuillConstructor = typeof import("quill").default;
type QuillInstance = InstanceType<QuillConstructor>;

type ImageUploadServerData = {
  uploadedBy: string;
  url: string;
};

type ImageUploadResult = ClientUploadedFileData<ImageUploadServerData>;

export interface QuillEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeightClassName?: string;
}

export function QuillEditor({
  value,
  onChange,
  placeholder,
  className,
  minHeightClassName = "min-h-[320px]",
}: QuillEditorProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<QuillInstance | null>(null);
  const lastHtmlRef = useRef<string>(value ?? "");
  const isPushingExternalValueRef = useRef(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const throttledEmitRef = useRef<ReturnType<typeof throttle> | null>(null);

  const normalizeHtml = useCallback((html: string) => {
    const trimmed = (html ?? "").trim();
    if (!trimmed) return "";
    // Quill's empty document HTML.
    if (trimmed === "<p><br></p>") return "";
    return trimmed;
  }, []);

  const insertImageAtCursor = useCallback(
    (url: string) => {
      const quill = quillRef.current;
      if (!quill) return;
      const range = quill.getSelection(true);
      const index = range?.index ?? Math.max(0, quill.getLength() - 1);
      quill.insertEmbed(index, "image", url, "user");
      quill.setSelection(index + 1, 0, "user");
    },
    []
  );

  const uploadAndInsertImageFile = useCallback(
    async (file: File) => {
      if (!file) return;
      if (!file.type?.startsWith("image/")) return;

      setIsUploadingImage(true);
      try {
        const res = await uploadFiles("imageUploader", { files: [file] });
        const first = res?.[0] as ImageUploadResult | undefined;
        const url = first?.serverData?.url;

        if (!url || typeof url !== "string") {
          console.error("UploadThing: no URL returned", res);
          window.alert("Image upload failed (no URL returned). Please try again.");
          return;
        }

        insertImageAtCursor(url);
      } catch (err) {
        console.error("UploadThing: image upload failed", err);
        window.alert("Image upload failed. Please try again.");
      } finally {
        setIsUploadingImage(false);
      }
    },
    [insertImageAtCursor]
  );

  const pickAndUploadImage = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      await uploadAndInsertImageFile(file);
    };

    input.click();
  }, [uploadAndInsertImageFile]);

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["link", "image"],
          ["clean"],
        ],
      },
      clipboard: {
        matchVisual: false,
      },
    };
  }, []);

  const formats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "list",
      "align",
      "link",
      "image",
    ],
    []
  );

  // Create Quill instance (client-only).
  useEffect(() => {
    let disposed = false;
    let onPaste: ((e: ClipboardEvent) => void) | null = null;
    let onDrop: ((e: DragEvent) => void) | null = null;
    const editorEl = editorRef.current;

    (async () => {
      if (!editorEl) return;

      const imported = await import("quill");
      const Quill = (imported.default ?? imported) as unknown as QuillConstructor;

      if (disposed) return;

      const quill = new Quill(editorEl, {
        theme: "snow",
        placeholder,
        modules,
        formats,
      });

      quillRef.current = quill;

      // Register toolbar handlers after init (more reliable across Quill builds).
      const toolbar = quill.getModule("toolbar") as unknown as
        | { addHandler?: (name: string, handler: () => void) => void }
        | null;
      if (toolbar?.addHandler) {
        toolbar.addHandler("image", () => void pickAndUploadImage());
      }

      // Initialize content.
      const initialHtml = value ?? "";
      if (initialHtml) {
        isPushingExternalValueRef.current = true;
        quill.clipboard.dangerouslyPasteHTML(initialHtml);
        isPushingExternalValueRef.current = false;
      }
      lastHtmlRef.current = quill.root?.innerHTML ?? "";

      throttledEmitRef.current = throttle(() => {
        if (isPushingExternalValueRef.current) return;
        const html = normalizeHtml(quill.root?.innerHTML ?? "");
        lastHtmlRef.current = html;
        onChange(html);
      }, 150);

      quill.on("text-change", () => {
        throttledEmitRef.current?.();
      });

      // Paste image -> upload -> insert
      onPaste = (e: ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;
        const imageItem = Array.from(items).find((it) => it.type?.startsWith("image/"));
        if (!imageItem) return;
        const file = imageItem.getAsFile();
        if (!file) return;
        e.preventDefault();
        void uploadAndInsertImageFile(file);
      };

      // Drop image -> upload -> insert
      onDrop = (e: DragEvent) => {
        const files = e.dataTransfer?.files;
        if (!files || files.length === 0) return;
        const file = files[0];
        if (!file?.type?.startsWith("image/")) return;
        e.preventDefault();
        void uploadAndInsertImageFile(file);
      };

      quill.root?.addEventListener("paste", onPaste as unknown as EventListener);
      quill.root?.addEventListener("drop", onDrop as unknown as EventListener);
    })();

    return () => {
      disposed = true;
      const quill = quillRef.current;
      if (quill?.root) {
        if (onPaste)
          quill.root.removeEventListener(
            "paste",
            onPaste as unknown as EventListener
          );
        if (onDrop)
          quill.root.removeEventListener(
            "drop",
            onDrop as unknown as EventListener
          );
      }
      throttledEmitRef.current?.cancel?.();
      quillRef.current = null;
      if (editorEl) editorEl.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep editor in sync if parent updates value (e.g. load content for edit).
  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;
    const next = value ?? "";
    const current = quill.root?.innerHTML ?? "";
    if (next === current) return;
    if (next === lastHtmlRef.current) return;

    isPushingExternalValueRef.current = true;
    const selection = quill.getSelection();
    quill.clipboard.dangerouslyPasteHTML(next);
    if (selection) {
      quill.setSelection(selection);
    }
    isPushingExternalValueRef.current = false;
    lastHtmlRef.current = next;
  }, [value]);

  return (
    <div ref={hostRef} className={cn("quill-scope relative", className)}>
      {isUploadingImage ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/70 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading image…
          </div>
        </div>
      ) : null}
      <div ref={editorRef} className={cn("bg-background", minHeightClassName)} />
    </div>
  );
}
