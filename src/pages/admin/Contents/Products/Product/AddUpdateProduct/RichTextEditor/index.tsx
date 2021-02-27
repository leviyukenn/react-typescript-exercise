import React, { useCallback, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function RichTextEditor({
  editorState,
  setEditorState,
}: {
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}) {
  const onEditorStateChange = useCallback(
    (editorState: EditorState) => {
      setEditorState(editorState);
    },
    [setEditorState]
  );
  return (
    <div>
      <Editor
        editorState={editorState}
        editorStyle={{
          border: "1px solid black",
          paddingLeft: "10px",
          minHeight: "200px",
        }}
        onEditorStateChange={onEditorStateChange}
      />
    </div>
  );
}
