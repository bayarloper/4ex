"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTheme } from "next-themes";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";

import { RichTextProvider } from "reactjs-tiptap-editor";

// Base kit
import { Document } from "@tiptap/extension-document";
import { Text } from "@tiptap/extension-text";
import { Paragraph } from "@tiptap/extension-paragraph";
import { HardBreak } from "@tiptap/extension-hard-break";
import { TextStyle } from "@tiptap/extension-text-style";
import { ListItem } from "@tiptap/extension-list";
import {
  Dropcursor,
  Gapcursor,
  Placeholder,
  TrailingNode,
  CharacterCount,
} from "@tiptap/extensions";

// Demo-style build extensions + UI
import { Blockquote, RichTextBlockquote } from "reactjs-tiptap-editor/blockquote";
import { Bold, RichTextBold } from "reactjs-tiptap-editor/bold";
import { BulletList, RichTextBulletList } from "reactjs-tiptap-editor/bulletlist";
import { Callout, RichTextCallout } from "reactjs-tiptap-editor/callout";
import { Clear, RichTextClear } from "reactjs-tiptap-editor/clear";
import { Code, RichTextCode } from "reactjs-tiptap-editor/code";
import { CodeBlock, RichTextCodeBlock } from "reactjs-tiptap-editor/codeblock";
import { CodeView, RichTextCodeView } from "reactjs-tiptap-editor/codeview";
import { Color, RichTextColor } from "reactjs-tiptap-editor/color";
import {
  Column,
  ColumnNode,
  MultipleColumnNode,
  RichTextColumn,
} from "reactjs-tiptap-editor/column";
import { Drawer, RichTextDrawer } from "reactjs-tiptap-editor/drawer";
import { Emoji, RichTextEmoji } from "reactjs-tiptap-editor/emoji";
import { Excalidraw, RichTextExcalidraw } from "reactjs-tiptap-editor/excalidraw";
import { FontFamily, RichTextFontFamily } from "reactjs-tiptap-editor/fontfamily";
import { FontSize, RichTextFontSize } from "reactjs-tiptap-editor/fontsize";
import { Heading, RichTextHeading } from "reactjs-tiptap-editor/heading";
import { Highlight, RichTextHighlight } from "reactjs-tiptap-editor/highlight";
import { History, RichTextRedo, RichTextUndo } from "reactjs-tiptap-editor/history";
import { HorizontalRule, RichTextHorizontalRule } from "reactjs-tiptap-editor/horizontalrule";
import { Iframe, RichTextIframe } from "reactjs-tiptap-editor/iframe";
import { Image, RichTextImage } from "reactjs-tiptap-editor/image";
import { ImageGif, RichTextImageGif } from "reactjs-tiptap-editor/imagegif";
import { Indent, RichTextIndent } from "reactjs-tiptap-editor/indent";
import { Italic, RichTextItalic } from "reactjs-tiptap-editor/italic";
import { Katex, RichTextKatex } from "reactjs-tiptap-editor/katex";
import { LineHeight, RichTextLineHeight } from "reactjs-tiptap-editor/lineheight";
import { Link, RichTextLink } from "reactjs-tiptap-editor/link";
import { Mention } from "reactjs-tiptap-editor/mention";
import { Mermaid, RichTextMermaid } from "reactjs-tiptap-editor/mermaid";
import { MoreMark, RichTextMoreMark } from "reactjs-tiptap-editor/moremark";
import { OrderedList, RichTextOrderedList } from "reactjs-tiptap-editor/orderedlist";
import {
  SearchAndReplace,
  RichTextSearchAndReplace,
} from "reactjs-tiptap-editor/searchandreplace";
import { SlashCommand, SlashCommandList } from "reactjs-tiptap-editor/slashcommand";
import { Strike, RichTextStrike } from "reactjs-tiptap-editor/strike";
import { Table, RichTextTable } from "reactjs-tiptap-editor/table";
import { TaskList, RichTextTaskList } from "reactjs-tiptap-editor/tasklist";
import { TextAlign, RichTextAlign } from "reactjs-tiptap-editor/textalign";
import { TextDirection, RichTextTextDirection } from "reactjs-tiptap-editor/textdirection";
import { TextUnderline, RichTextUnderline } from "reactjs-tiptap-editor/textunderline";
import { Twitter, RichTextTwitter } from "reactjs-tiptap-editor/twitter";
import { Video, RichTextVideo } from "reactjs-tiptap-editor/video";
import {
  RichTextBubbleCallout,
  RichTextBubbleColumns,
  RichTextBubbleDrawer,
  RichTextBubbleExcalidraw,
  RichTextBubbleIframe,
  RichTextBubbleImage,
  RichTextBubbleImageGif,
  RichTextBubbleKatex,
  RichTextBubbleLink,
  RichTextBubbleMenuDragHandle,
  RichTextBubbleMermaid,
  RichTextBubbleTable,
  RichTextBubbleText,
  RichTextBubbleTwitter,
  RichTextBubbleVideo,
} from "reactjs-tiptap-editor/bubble";

import { cn } from "@/lib/utils";
import { uploadFiles } from "@/lib/uploadthing";
import type { ClientUploadedFileData } from "uploadthing/types";

type ImageUploadServerData = {
  uploadedBy: string;
  url: string;
};

type ImageUploadResult = ClientUploadedFileData<ImageUploadServerData>;

const LIMIT = 2505;

// custom document to support columns (from the demo)
const DocumentColumn = Document.extend({
  content: "(block|columns)+",
});

const MOCK_USERS = [
  { id: "0", label: "hunghg255" },
  { id: "1", label: "benjamincanac" },
  { id: "2", label: "atinux" },
  { id: "3", label: "danielroe" },
  { id: "4", label: "pi0" },
];

function useDebouncedCallback<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  waitMs: number,
) {
  const fnRef = useRef(fn);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  return useCallback(
    (...args: TArgs) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => fnRef.current(...args), waitMs);
    },
    [waitMs],
  );
}

function RichTextToolbar({ showImageGif }: { showImageGif: boolean }) {
  return (
    <div className="flex items-center !p-1 gap-2 flex-wrap !border-b !border-solid !border-border">
      <RichTextUndo />
      <RichTextRedo />
      <RichTextSearchAndReplace />
      <RichTextClear />
      <RichTextFontFamily />
      <RichTextHeading />
      <RichTextFontSize />
      <RichTextBold />
      <RichTextItalic />
      <RichTextUnderline />
      <RichTextStrike />
      <RichTextMoreMark />
      <RichTextEmoji />
      <RichTextColor />
      <RichTextHighlight />
      <RichTextBulletList />
      <RichTextOrderedList />
      <RichTextAlign />
      <RichTextIndent />
      <RichTextLineHeight />
      <RichTextTaskList />
      <RichTextLink />
      <RichTextImage />
      <RichTextVideo />
      {showImageGif ? <RichTextImageGif /> : null}
      <RichTextBlockquote />
      <RichTextHorizontalRule />
      <RichTextCode />
      <RichTextCodeBlock />
      <RichTextColumn />
      <RichTextTable />
      <RichTextIframe />
      <RichTextTextDirection />
      <RichTextKatex />
      <RichTextExcalidraw />
      <RichTextMermaid />
      <RichTextDrawer />
      <RichTextTwitter />
      <RichTextCodeView />
      <RichTextCallout />
    </div>
  );
}

function CharacterCountFooter({ editor }: { editor: ReturnType<typeof useEditor> }) {
  const { charactersCount, wordsCount } = useEditorState({
    editor,
    selector: (context) => ({
      charactersCount: context.editor.storage.characterCount.characters(),
      wordsCount: context.editor.storage.characterCount.words(),
    }),
  });

  if (!editor) return null;
  const percentage = Math.round((100 / LIMIT) * charactersCount);

  return (
    <div
      className={cn(
        "character-count !border-t !border-border p-3",
        charactersCount >= LIMIT && "character-count--warning",
      )}
    >
      <svg height="20" width="20" viewBox="0 0 20 20">
        <circle r="10" cx="10" cy="10" fill="hsl(var(--muted) / 0.4)" />
        <circle
          r="5"
          cx="10"
          cy="10"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="10"
          strokeDasharray={`calc(${percentage} * 31.4 / 100) 31.4`}
          transform="rotate(-90) translate(-20)"
        />
        <circle r="6" cx="10" cy="10" fill="hsl(var(--background))" />
      </svg>
      {charactersCount} / {LIMIT} characters
      <br />
      {wordsCount} words
    </div>
  );
}

export interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeightClassName?: string;
}

export function TiptapEditor({
  value,
  onChange,
  placeholder,
  className,
  minHeightClassName = "min-h-[320px]",
}: TiptapEditorProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const lastHtmlRef = useRef<string>((value ?? "").trim());
  const isPushingExternalValueRef = useRef(false);

  const debouncedOnChange = useDebouncedCallback((html: string) => {
    onChange(html);
  }, 300);

  const uploadImage = useCallback(async (file: File) => {
    const res = await uploadFiles("imageUploader", { files: [file] });
    const first = res?.[0] as ImageUploadResult | undefined;
    const url = first?.serverData?.url;
    if (!url || typeof url !== "string") {
      throw new Error("Upload failed (no URL returned)");
    }
    return url;
  }, []);

  const giphyKey = process.env.NEXT_PUBLIC_GIPHY_API_KEY;

  const extensions = useMemo(() => {
    const baseKit = [
      DocumentColumn,
      Text,
      Dropcursor.configure({
        class: "reactjs-tiptap-editor-theme",
        color: "hsl(var(--primary))",
        width: 2,
      }),
      Gapcursor,
      HardBreak,
      Paragraph,
      TrailingNode,
      ListItem,
      TextStyle,
      Placeholder.configure({
        placeholder: placeholder ?? "Press '/' for commands",
      }),
    ];

    const built = [
      ...baseKit,
      CharacterCount.configure({ limit: LIMIT }),

      History,
      SearchAndReplace,
      Clear,
      FontFamily,
      Heading,
      FontSize,
      Bold,
      Italic,
      TextUnderline,
      Strike,
      MoreMark,
      Emoji,
      Color,
      Highlight,
      BulletList,
      OrderedList,
      TextAlign,
      Indent,
      LineHeight,
      TaskList,
      Link,
      Image.configure({
        resourceImage: "upload",
        upload: uploadImage,
      }),
      Video,
      ...(giphyKey
        ? [
            ImageGif.configure({
              provider: "giphy",
              API_KEY: giphyKey,
            }),
          ]
        : []),
      Blockquote,
      HorizontalRule,
      Code,
      CodeBlock,

      Column,
      ColumnNode,
      MultipleColumnNode,
      Table,
      Iframe,
      TextDirection,
      Katex,
      Excalidraw,
      Mermaid.configure({
        upload: uploadImage,
      }),
      Drawer.configure({
        upload: uploadImage,
      }),
      Twitter,
      Mention.configure({
        suggestions: [
          {
            char: "@",
            items: async ({ query }: { query: string }) => {
              return MOCK_USERS.filter((item) =>
                item.label.toLowerCase().startsWith(query.toLowerCase()),
              );
            },
          },
        ],
      }),
      SlashCommand,
      CodeView,
      Callout,
    ];

    return built;
  }, [giphyKey, placeholder, uploadImage]);

  const editor = useEditor({
    // Next.js (App Router) can render Client Components during SSR.
    // TipTap recommends disabling immediate rendering to avoid hydration mismatches.
    immediatelyRender: false,
    extensions,
    content: value ?? "",
    textDirection: "auto",
    onUpdate: ({ editor }) => {
      if (isPushingExternalValueRef.current) return;
      const html = (editor.getHTML() ?? "").trim();
      lastHtmlRef.current = html;
      debouncedOnChange(html);
    },
  });

  // Sync external changes (e.g. loading data for edit)
  useEffect(() => {
    if (!editor) return;
    const next = (value ?? "").trim();
    if (next === lastHtmlRef.current) return;

    isPushingExternalValueRef.current = true;
    editor.commands.setContent(next || "", { emitUpdate: false });
    isPushingExternalValueRef.current = false;
    lastHtmlRef.current = next;
  }, [editor, value]);

  if (!editor) {
    return (
      <div className={cn("relative", className)}>
        <div className={cn("rounded-lg border border-border bg-background", minHeightClassName)} />
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <RichTextProvider editor={editor} dark={isDark}>
        <div className="overflow-hidden rounded-[0.5rem] bg-background !border !border-border">
          <div className="flex max-h-full w-full flex-col">
            <RichTextToolbar showImageGif={Boolean(giphyKey)} />

            <EditorContent editor={editor} className={cn("px-3 py-3", minHeightClassName)} />

            {/* Bubble */}
            <RichTextBubbleColumns />
            <RichTextBubbleDrawer />
            <RichTextBubbleExcalidraw />
            <RichTextBubbleIframe />
            <RichTextBubbleKatex />
            <RichTextBubbleLink />
            <RichTextBubbleImage />
            <RichTextBubbleVideo />
            {giphyKey ? <RichTextBubbleImageGif /> : null}
            <RichTextBubbleMermaid />
            <RichTextBubbleTable />
            <RichTextBubbleText />
            <RichTextBubbleTwitter />
            <RichTextBubbleCallout />

            {/* Command List */}
            <SlashCommandList />
            <RichTextBubbleMenuDragHandle />
          </div>

          <CharacterCountFooter editor={editor} />
        </div>
      </RichTextProvider>
    </div>
  );
}
