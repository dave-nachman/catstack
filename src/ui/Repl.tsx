import React from "react";
import Terminal from "terminal-in-react";
import { prettyPrint } from "../language/prettyPrint";
import { useInterpreter } from "./useInterpreter";

export const Repl = ({
  interpreter,
  setInterpreter,
  undo,
  redo
}: ReturnType<typeof useInterpreter>) => {
  return (
    <Terminal
      color="#555"
      outputColor="#888"
      prompt="#888"
      backgroundColor="white"
      barColor="black"
      style={{
        fontWeight: "bold",
        fontSize: 16,
        overflow: "hidden !important"
      }}
      hideTopBar={true}
      allowTabs={false}
      commandPassThrough={(cmd, print: any) => {
        const input = Array.isArray(cmd) ? cmd.join(" ").trim() : cmd.trim();
        if (input === "undo") {
          return undo();
        } else if (input === "redo") {
          return redo();
        } else {
          try {
            const nextInterpreter = interpreter.interpret(input, {
              print: ({ stack, environment }) => {
                if (stack.length) {
                  print(`OUT: ${prettyPrint(stack.pop()!)}`);
                  return { stack, environment };
                } else {
                  throw new Error(
                    "Invalid stack - expected at least one value"
                  );
                }
              }
            });
            if (nextInterpreter) {
              setInterpreter(nextInterpreter);
              return nextInterpreter.stack.map(prettyPrint).join(" ");
            }
          } catch (e) {
            return String(e);
          }
        }
      }}
    />
  );
};
