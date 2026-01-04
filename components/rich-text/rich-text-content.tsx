import { cn } from "@/lib/utils";

export default function RichTextContent({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  const isCompact = (className ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .includes("compact");

  return (
    <div className={cn("rich-text-content ql-container ql-snow", className)}>
      <div
        className={cn(
          "ql-editor",
          // Default Quill padding is generous; keep compact previews tight.
          isCompact ? "p-0" : undefined
        )}
        // Content comes from your admins.
        dangerouslySetInnerHTML={{ __html: html ?? "" }}
      />
    </div>
  );
}
