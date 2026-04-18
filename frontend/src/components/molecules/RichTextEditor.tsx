"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

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
          else editor.chain().focus().toggleHeading({ level: parseInt(v) as 1 | 2 | 3 }).run();
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

      <button type="button" className={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()} title="Fet">
        B
      </button>
      <button type="button" className={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()} title="Kursiv">
        <em>I</em>
      </button>

      <div className="w-px h-4 bg-gray-200 mx-1" />

      <button type="button" className={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Punktliste">
        ≡
      </button>
      <button type="button" className={btn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Nummerert liste">
        1.
      </button>
    </div>
  );
}

export function RichTextEditor({ content, onChange, disabled = false }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (disabled) {
    return (
      <div
        className="prose prose-sm max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="flex-1 overflow-y-auto px-4 py-3 prose prose-sm max-w-none text-gray-800 [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-40"
      />
    </div>
  );
}
