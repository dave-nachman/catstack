import React from "react";
import { prettyPrint } from "../language/prettyPrint";
import { Interpreter } from "../language/interpreter";

export const Stack = ({ interpreter }: { interpreter: Interpreter }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h3>Stack</h3>
      {interpreter.stack.length === 0 ? (
        <span
          style={{
            marginTop: 12,
            opacity: 0.5
          }}
        >
          (empty)
        </span>
      ) : (
        <></>
      )}
      {[...interpreter.stack].reverse().map((value, index) => (
        <div
          key={index}
          style={{
            backgroundColor: "#eee",
            borderRadius: 5,
            padding: 12,
            margin: "2px 0",
            overflow: "hidden",
            opacity: Math.max(1 - index * 0.2, 0.4)
          }}
        >
          {prettyPrint(value)}
        </div>
      ))}
    </div>
  );
};
