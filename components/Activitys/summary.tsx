// import { pusherClient } from '@/lib/pusher';
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// interface Props {
//   summary: string;
//   id: string
// }

// const Summary: React.FC<Props> = ({ summary, id }: Props) => {
//   const [input, setInput] = useState(summary);
  

//   // useEffect(() => {
      
//   //   pusherClient.subscribe(id)

//   //   pusherClient.bind('incoming-message', (text: string) => {
//   //     setInput(text)
//   //   })

//   //   return () => {
//   //     pusherClient.unsubscribe(id)
//   //   }

//   // }, []); // Empty dependency array ensures the effect runs once

//   const onChangeHandler = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setInput(e.target.value);

//     await axios.post('/api/socket', { input, id })
//   };

//   return (
//     <textarea
//       placeholder="Type something"
//       value={input}
//       onChange={onChangeHandler}
//       className="w-full h-full"
//     />
//   );
// };

// export default Summary;

import React from "react";
import './page.css'
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TipTapMenuBar from "../TipTapMenuBar";
import { useDebounce } from "@/lib/useDebounce";
import { useMutation } from "@tanstack/react-query";
import Text from "@tiptap/extension-text";
import axios from "axios";
import { useCompletion } from "ai/react";
import './style.css'

interface Props {
  summary: string;
  id: string
}

const Summary: React.FC<Props> = ({ summary, id }: Props) => {
  const formattedSummary = summary.replace(/\n/g, '<br>');


  const [editorState, setEditorState] = React.useState(formattedSummary);
  const { complete, completion } = useCompletion({
    api: "/api/completion",
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
    onUpdate: async ({ editor }) => {
      setEditorState(editor.getHTML());
      var editors = editor.getHTML()
      await axios.post('/api/socket', { input: editors, id: id })
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


  const handleAutocompleteClick = () => {
  if (editor) {
    const content = editor.getHTML();
    complete(content);
  }
};


  return (
    <div className="scrolling-wrapper">
      <div className="flex bg-white ">
        {editor && <TipTapMenuBar editor={editor} />}
      </div>

      <div className="prose prose-sm w-full mt-4 bg-white">
        <EditorContent editor={editor} />
      </div>
      <div className="h-4"></div>
       <button className='generate-button' onClick={handleAutocompleteClick}>Autocomplete</button>
    </div>
  );
};

export default Summary;

