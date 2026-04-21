"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect, useRef } from "react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Extension } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";

const HINT_COLOR_HEX = "#9ca3af";
// Browsers normalize hex to rgb() when parsing inline HTML styles
const HINT_COLOR_RGB = "rgb(156, 163, 175)";

function isHintColor(color: string | undefined): boolean {
  return color === HINT_COLOR_HEX || color === HINT_COLOR_RGB;
}

// Removes grey hint text from a list item when the user types real content,
// and restores it if the user deletes everything they typed.
const HintCleaner = Extension.create({
  name: "hintCleaner",

  addStorage() {
    return {
      // Maps bold label (e.g. "Tiltak iverksatt") → original hint text
      hintsByLabel: new Map<string, string>(),
    };
  },

  addProseMirrorPlugins() {
    const storage = this.storage as {
      hintsByLabel: Map<string, string>;
    };

    return [
      new Plugin({
        props: {
          // Strip hint color/italic from stored marks when the cursor is inside
          // a hint span, so the next typed character won't inherit those marks.
          handleKeyDown(view, event) {
            if (
              event.key.length !== 1 ||
              event.ctrlKey ||
              event.metaKey ||
              event.altKey
            )
              return false;

            const { state } = view;
            const { $from } = state.selection;
            const currentMarks = state.storedMarks ?? $from.marks();
            const isInHint = currentMarks.some(
              (m) =>
                m.type.name === "textStyle" &&
                isHintColor((m.attrs as { color?: string }).color),
            );

            if (isInHint) {
              const cleanMarks = currentMarks.filter(
                (m) =>
                  !(
                    m.type.name === "textStyle" &&
                    isHintColor((m.attrs as { color?: string }).color)
                  ) && m.type.name !== "italic",
              );
              view.dispatch(state.tr.setStoredMarks(cleanMarks));
            }

            return false;
          },
        },

        appendTransaction(transactions, _oldState, newState) {
          if (!transactions.some((tr) => tr.docChanged)) return null;

          const tr = newState.tr;
          let changed = false;

          newState.doc.descendants((node, pos) => {
            if (node.type.name !== "listItem") return true;

            const hintRanges: Array<{
              from: number;
              to: number;
              text: string;
            }> = [];
            let boldLabel = "";
            let hasOtherText = false;

            node.descendants((child, childPos) => {
              if (!child.isText) return true;
              const isHint = child.marks.some(
                (m) =>
                  m.type.name === "textStyle" &&
                  isHintColor((m.attrs as { color?: string }).color),
              );
              const isBold = child.marks.some((m) => m.type.name === "bold");

              if (isHint && child.text) {
                hintRanges.push({
                  from: pos + 1 + childPos,
                  to: pos + 1 + childPos + child.nodeSize,
                  text: child.text,
                });
              } else if (isBold) {
                boldLabel += child.text ?? "";
              } else if (child.text?.trim()) {
                hasOtherText = true;
              }
              return true;
            });

            const label = boldLabel.replace(/:$/, "").trim();

            if (hasOtherText && hintRanges.length > 0) {
              // Save hint before removing so it can be restored later
              if (label)
                storage.hintsByLabel.set(
                  label,
                  hintRanges.map((r) => r.text).join(""),
                );
              for (const range of [...hintRanges].reverse()) {
                tr.delete(range.from, range.to);
              }
              changed = true;
            } else if (!hasOtherText && hintRanges.length === 0 && label) {
              // List item is back to just the bold label — restore stored hint
              const stored = storage.hintsByLabel.get(label);
              if (!stored) return false;

              // Find end of first paragraph's content to insert after bold text
              let insertPos = -1;
              node.descendants((child, childPos) => {
                if (child.type.name === "paragraph" && insertPos === -1) {
                  insertPos = pos + 1 + childPos + child.content.size;
                  return false;
                }
                return true;
              });
              if (insertPos === -1) return false;

              const schema = newState.schema;
              const hintMark = schema.marks.textStyle?.create({
                color: HINT_COLOR_HEX,
              });
              const italicMark = schema.marks.italic?.create();
              const activeMarks = [hintMark, italicMark].filter(
                Boolean,
              ) as import("@tiptap/pm/model").Mark[];
              tr.insert(insertPos, schema.text(` ${stored}`, activeMarks));
              changed = true;
            }

            return false;
          });

          return changed ? tr : null;
        },
      }),
    ];
  },
});

type RichTextEditorProps = {
  content: string;
  onChange: (html: string) => void;
  disabled?: boolean;
};

function Toolbar({ editor }: { editor: ReturnType<typeof useEditor> | null }) {
  if (!editor) return null;

  const btn = (active: boolean) =>
    `px-2 py-1 rounded text-sm font-medium transition-colors ${
      active ? "bg-gray-200 text-gray-900" : "text-gray-500 hover:bg-gray-100"
    }`;

  return (
    <div className="flex items-center gap-1 border-b border-gray-200 px-3 py-2">
      <select
        className="text-sm border border-gray-200 rounded px-1 py-0.5 mr-2 text-gray-700"
        onChange={(e) => {
          const v = e.target.value;
          if (v === "p") editor.chain().focus().setParagraph().run();
          else
            editor
              .chain()
              .focus()
              .toggleHeading({ level: parseInt(v) as 1 | 2 | 3 })
              .run();
        }}
        value={
          editor.isActive("heading", { level: 1 })
            ? "1"
            : editor.isActive("heading", { level: 2 })
              ? "2"
              : "p"
        }
      >
        <option value="p">Brødtekst</option>
        <option value="1">Overskrift 1</option>
        <option value="2">Overskrift 2</option>
      </select>

      <button
        type="button"
        className={btn(editor.isActive("bold"))}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Fet"
      >
        B
      </button>
      <button
        type="button"
        className={btn(editor.isActive("italic"))}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Kursiv"
      >
        <em>I</em>
      </button>

      <div className="w-px h-4 bg-gray-200 mx-1" />

      <button
        type="button"
        className={btn(editor.isActive("bulletList"))}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Punktliste"
      >
        ≡
      </button>
      <button
        type="button"
        className={btn(editor.isActive("orderedList"))}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Nummerert liste"
      >
        1.
      </button>
    </div>
  );
}

export function RichTextEditor({
  content,
  onChange,
  disabled = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, TextStyle, Color, HintCleaner],
    content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external content changes (e.g. template selection) into the editor
  const prevContentRef = useRef(content);
  useEffect(() => {
    if (
      editor &&
      content !== prevContentRef.current &&
      content !== editor.getHTML()
    ) {
      editor.commands.setContent(content);
    }
    prevContentRef.current = content;
  }, [content, editor]);

  if (disabled) {
    return (
      <div
        className="prose prose-sm max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Toolbar editor={editor} />
      <div className="flex-1 h-0 overflow-y-auto">
        <EditorContent
          editor={editor}
          className="px-4 py-3 prose prose-sm max-w-none text-gray-800 [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-40 [&_.ProseMirror_span[style]]:text-[unset]"
        />
      </div>
    </div>
  );
}
