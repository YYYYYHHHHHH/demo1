import { useState } from "react";
import { Editor, EditorState } from "draft-js";

import "draft-js/dist/Draft.css";
import "./App.css";

function App() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  return (
    <div className="editor-body">
      <div className="tools">
        <div
          className='tool'
        >
          B
        </div>
      </div>
      <div className="editor-wrap">
        <Editor
          placeholder="请输入..."
          editorState={editorState}
          onChange={setEditorState}
        />
      </div>
    </div>
  );
}

export default App;
