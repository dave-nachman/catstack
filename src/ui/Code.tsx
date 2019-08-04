import Tippy from "@tippy.js/react";
import React, { useState } from "react";
import * as S from "semantic-ui-react";
import { useInterpreter } from "./useInterpreter";
import { Repl } from "./Repl";
import { Editor } from "./Editor";
import { CodeTab } from "./App";
import { InfoMark } from "./InfoMark";

export const Code = (props: ReturnType<typeof useInterpreter>) => {
  const { interpreter, setInterpreter } = props;
  const [codeTab, setCodeTab] = useState<CodeTab>(Object.values(CodeTab)[0]);
  const repl = <Repl {...props} />;
  const editor = (
    <Editor interpreter={interpreter} setInterpreter={setInterpreter} />
  );
  return (
    <S.Container>
      <h3>
        <span
          onClick={() => setCodeTab(CodeTab.REPL)}
          style={{
            marginRight: 12,
            cursor: "pointer",
            opacity: codeTab === CodeTab.REPL ? 1 : 0.5
          }}
        >
          <Tippy
            content={`REPL stands for "Read", "Evaluate", "Print", "Loop", and refers
  to the idea of evaluating a program in an interactive manner.
  `}
          >
            <span>
              REPL <InfoMark />
            </span>
          </Tippy>
        </span>{" "}
        <span
          onClick={() => setCodeTab(CodeTab.Editor)}
          style={{
            cursor: "pointer",
            opacity: codeTab === CodeTab.Editor ? 1 : 0.5
          }}
        >
          Editor
        </span>
      </h3>

      {codeTab === CodeTab.REPL ? repl : editor}
    </S.Container>
  );
};
