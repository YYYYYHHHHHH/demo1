import { useEffect, useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  KeyBindingUtil,
  getDefaultKeyBinding,
  CompositeDecorator,
  Modifier,
  SelectionState,
} from "draft-js";

import "draft-js/dist/Draft.css";
import "./App.css";

const regex = /\*\*(.*?)\*\*/g;

// 匹配规则

function App() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const doBold = () => {
    const selection = editorState.getSelection();

    if (!selection.isCollapsed()) {
      const newEditorState = RichUtils.toggleInlineStyle(editorState, "BOLD");
      setEditorState(newEditorState);
    }
  };

  const onBoldClick = () => {
    doBold();
  };

  // 自定义快捷键函数
  const keyBindingFn = (e) => {
    if (e.key === "b" && KeyBindingUtil.hasCommandModifier(e)) {
      return "my-bold";
    }

    // draft内置了许多快捷键处理，如undo、redo
    return getDefaultKeyBinding(e);
  };
  // 自定义指令处理
  const handleKeyCommand = (command) => {
    if (command === "my-bold") {
      doBold();
      return "handled";
    }

    return "not-handled";
  };

  const handleBeforeInput = (e) => {
    // 如果输入空格，需要检查markdown语法
    if (e === " ") {
      const selection = editorState.getSelection();
      const contentState = editorState.getCurrentContent();
      const block = contentState.getBlockForKey(selection.getStartKey());
      const text = block.getText();
      const startOffset = selection.getStartOffset();

      if (text.slice(startOffset - 2, startOffset) === "**") {
        let end = startOffset;
        let start = end - 3;

        while (start >= 0) {
          if (text.slice(start, start + 2) === "**") {
            break;
          } else {
            start--;
          }
        }
        if (start < 0) {
          return 'not-handled'
        }
        const newContentStateWithText = Modifier.replaceText(
          contentState,
          selection.merge({
            anchorOffset: start,
            focusOffset: end,
          }),
          regex.exec(text.slice(0, startOffset))?.[1],
          
        );
        
        const newContentStateWithBold = Modifier.applyInlineStyle(
          newContentStateWithText,
          selection.merge({
            anchorOffset: start,
            focusOffset: end - 4,
          }),
          "BOLD"
        );

        const newEditorState = EditorState.push(
          editorState,
          newContentStateWithBold,
          "insert-characters"
        );
        

        setEditorState(EditorState.moveFocusToEnd(newEditorState));
      }
      return "handled";
    }
  };

  return (
    <div className="editor-body">
      <div className="tools">
        <div className="tool" onClick={onBoldClick}>
          B
        </div>
      </div>
      <div className="editor-wrap">
        <Editor
          placeholder="请输入..."
          editorState={editorState}
          onChange={setEditorState}
          keyBindingFn={keyBindingFn}
          handleKeyCommand={handleKeyCommand}
          handleBeforeInput={handleBeforeInput}
        />
      </div>
    </div>
  );
}

export default App;
