import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { useEffect } from "react";
import { Button } from "./button";

interface BlogEditorProps {
  content: string;
  setContent: (value: string) => void;
  setPlainText: (value: string) => void;
  setWordCount: (count: number) => void;
  getEditor?: (editor: any) => void;
}

export default function BlogEditor({ content, setContent, setWordCount, setPlainText, getEditor }: BlogEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content,
    onUpdate({ editor }) {
        const html = editor.getHTML();
        const plainText = editor.state.doc.textContent || "";

        setContent(html);
        setPlainText(plainText);
        const words = plainText.trim().split(/\s+/).filter(Boolean);
        setWordCount(words.length);
        },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  useEffect(() => {
    if (editor && getEditor) {
      getEditor(editor);
    }
  }, [editor, getEditor]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4 sm:space-x-3 justify-between sm:justify-normal">
        <Button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={editor?.isActive("bold") ? "font-bold underline outline-2" : "outline-2 "}
        >
          Bold
        </Button>
        <Button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive("italic") ? "italic underline outline-2" : "outline-2"}
        >
          Italic
        </Button>
        <Button
          type="button"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={editor?.isActive("underline") ? "underline font-semibold outline-2" : "outline-2"}
        >
          Underline
        </Button>
      </div>

      <EditorContent editor={editor} className="border p-4 min-h-[500px] leading-relaxed" />
    </div>
  );
}
