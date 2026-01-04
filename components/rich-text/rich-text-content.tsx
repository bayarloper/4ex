import { cn } from "@/lib/utils";

export default function RichTextContent({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  return (
    <div
      className={cn("rich-text-content", className)}
      // Content comes from your admins.
      dangerouslySetInnerHTML={{ __html: html ?? "" }}
    />
  );
}
