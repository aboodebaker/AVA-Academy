'use client'
import React from "react";
import './page.css'
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TipTapMenuBar from "./TipTapMenuBar";
import { Button } from "./ui/button";
import { useDebounce } from "@/lib/useDebounce";
import { useMutation } from "@tanstack/react-query";
import Text from "@tiptap/extension-text";
import axios from "axios";
console.log(StarterKit);
import { useCompletion } from "ai/react";

type Props = { note: any };

const TipTapEditor = ({ note }: Props) => {
  const [editorState, setEditorState] = React.useState(
    note.editorState ||
      `<b><h1>${note.title}</h1></b>
    `
  );
  const { complete, completion } = useCompletion({
    api: "/api/completion",
  });
  const saveNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/saveNote", {
        noteId: note.id,
        editorState,
      });
      return response.data;
    },
  });
  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Shift-a": () => {
          // take the last 30 words
          const prompt = this.editor.getText().split(" ").slice(-30).join(" ");
          complete(prompt);
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit, customText],
    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
    },
  });
  const lastCompletion = React.useRef("");

  React.useEffect(() => {
    if (!completion || !editor) return;
    const diff = completion.slice(lastCompletion.current.length);
    lastCompletion.current = completion;
    editor.commands.insertContent(diff);
  }, [completion, editor]);

  const debouncedEditorState = useDebounce(editorState, 500);
  React.useEffect(() => {
    // save to db
    if (debouncedEditorState === "") return;
    saveNote.mutate(undefined, {
      onSuccess: (data) => {
        console.log("success update!", data);
      },
      onError: (err) => {
        console.error(err);
      },
    });
  }, [debouncedEditorState]);

  const handleAutocompleteClick = () => {
  if (editor) {
    const content = editor.getHTML();
    complete(content);
  }
};


  return (
    <>
      <div className="flex bg-background">
        {editor && <TipTapMenuBar editor={editor} />}
        <Button disabled variant={"outline"} onClick={handleAutocompleteClick} className="text-text bg-primarys rounded  rounded-lg shadow-3xl w-[9rem]">
          {saveNote.isLoading ? "Saving..." : "Saved"}
        </Button>
      </div>

      <div className="prose prose-sm w-full mt-4 transparent">
        <EditorContent editor={editor} />
      </div>
      <div className="h-4"></div>
       <button className='generate-button' onClick={handleAutocompleteClick}>Autocomplete</button>
    </>
  );
};

export default TipTapEditor;
