"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface Props {
  value: string;
  onChange: (text: string) => void;
}

export default function RichEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: "prose max-w-none min-h-56 p-3 focus:outline-none" },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getText());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getText()) {
      // 外部更新時は内容を同期（簡易）
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="rounded border">
      <div className="flex gap-2 border-b p-2 text-sm">
        <button
          type="button"
          className="rounded px-2 py-1 hover:bg-gray-100"
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <b>B</b>
        </button>
        <button
          type="button"
          className="rounded px-2 py-1 hover:bg-gray-100"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <i>I</i>
        </button>
        <button
          type="button"
          className="rounded px-2 py-1 hover:bg-gray-100"
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
