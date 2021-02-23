import React, { useCallback, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function RichTextEditor({
  setProductDetail,
}: {
  setProductDetail: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = useCallback(
    (editorState: EditorState) => {
      setProductDetail(
        draftToHtml(convertToRaw(editorState.getCurrentContent()))
      );
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
