import Tippy from "@tippy.js/react";
import React from "react";
import { definitions } from "../language/definitions";
import { defaultEnvironment } from "../language/defaultEnvironment";
import { prettyPrint } from "../language/prettyPrint";
import { Interpreter } from "../language/interpreter";
import { InfoMark } from "./InfoMark";

export const Environment = ({ interpreter }: { interpreter: Interpreter }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Tippy
        content={`The environment contains the mapping of names to values. 
        When a name is evaluated, the language runtime will look up the name in the environment. 
        If the name is missing, an error will be thrown.
    `}
      >
        <h3>
          Environment
          <InfoMark />
        </h3>
      </Tippy>
      <ul>
        {Object.entries(interpreter.environment).map(([key, value]) => (
          <li key={key}>
            <span style={{ width: 100, display: "inline-block" }}>
              {value === defaultEnvironment[key] && definitions[key] ? (
                <Tippy content={definitions[key]}>
                  <div>
                    <span style={{ marginRight: 2 }}>{key}</span>
                    <InfoMark />
                  </div>
                </Tippy>
              ) : (
                <span>{key}</span>
              )}
            </span>{" "}
            {typeof value === "function" ? (
              <span style={{ color: "#999" }}>{"<built-in>"}</span>
            ) : (
              prettyPrint(value as any)
            )}
          </li>
        ))}
      </ul>
      <h3>REPL Commands</h3>
      <ul>
        <li>undo</li>
        <li>redo</li>
      </ul>
    </div>
  );
};
