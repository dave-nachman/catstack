import React from "react";
import { createInterpreter, Interpreter } from "../language/interpreter";
import { Environment } from "../language/types";

export const useInterpreter = (customEnvironment?: Environment) => {
  const [index, setIndex] = React.useState(0);
  const [interpreters, setInterpreters] = React.useState([
    createInterpreter(customEnvironment)
  ]);

  return {
    interpreter: interpreters[index],
    setInterpreter: (nextInterpreter: Interpreter) => {
      setInterpreters(
        // if there are interpreters after the index (i.e. because of a redo), remove them
        // we are essentially forking the history
        interpreters.slice(0, index + 1).concat([nextInterpreter])
      );
      setIndex(index + 1);
    },
    undo: () => {
      if (index > 0) {
        setIndex(index - 1);
        return undefined;
      } else {
        return "Can't undo - there is no more history";
      }
    },
    redo: () => {
      if (index !== interpreters.length - 1) {
        setIndex(index + 1);
        return undefined;
      } else {
        return "Can't redo - there is no more history";
      }
    }
  };
};
