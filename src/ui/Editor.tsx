import React, { useState } from "react";
import * as S from "semantic-ui-react";
import SimpleCodeEditor from "react-simple-code-editor";
import { prettyPrint } from "../language/prettyPrint";
import { Interpreter } from "../language/interpreter";

export const Editor = ({
  interpreter,
  setInterpreter
}: {
  interpreter: Interpreter;
  setInterpreter: (interpreter: Interpreter) => void;
}) => {
  const [editorValue, setEditorValue] = useState("");
  const [editorError, setEditorError] = useState("");
  return (
    <S.Container>
      <SimpleCodeEditor
        value={editorValue}
        onValueChange={setEditorValue}
        highlight={code => code}
        style={{
          minHeight: 400,
          fontFamily: "Source Code Pro",
          border: "1px solid #eee"
        }}
      />
      <div>
        <S.Button
          style={{ marginTop: 12 }}
          onClick={() => {
            setEditorError("");
            try {
              const nextInterpreter = interpreter.interpret(editorValue.trim());
              if (nextInterpreter) {
                setInterpreter(nextInterpreter);
                return nextInterpreter.stack.map(prettyPrint).join(" ");
              }
            } catch (e) {
              setEditorError(String(e));
            }
          }}
        >
          Run
        </S.Button>
      </div>
      {editorError}
    </S.Container>
  );
};
