import { defaultEnvironment } from "./defaultEnvironment";
import { parser } from "./parser";
import { evaluate } from "./evaluator";
import { StackValue, Environment } from "./types";

export class ParseError extends Error {}

export interface Interpreter {
  stack: StackValue[];
  environment: Environment;
  interpret: (input: string) => Interpreter;
}

const interpret = (
  input: string,
  stack: StackValue[],
  environment: Environment
): Interpreter => {
  const parseResult = parser.parse(input);

  if (parseResult.status) {
    const result = parseResult.value.reduce(
      ({ stack, environment }, token) => {
        return evaluate(
          token,
          [...stack], // built-in functions might mutably pop the stack, so pass in shallow copy
          environment
        );
      },
      { stack, environment }
    );

    return {
      ...result,
      interpret: (input: string) =>
        interpret(input, result.stack, result.environment)
    };
  } else {
    throw new ParseError(`"${input}" is not a valid input`);
  }
};

export const createInterpreter = (customEnvironment?: Environment) => {
  const stack: StackValue[] = [];
  const environment = { ...defaultEnvironment, ...customEnvironment };

  return {
    interpret: (input: string, customEnvironment?: Environment) =>
      interpret(input, stack, { ...environment, ...customEnvironment }),
    stack,
    environment
  };
};
