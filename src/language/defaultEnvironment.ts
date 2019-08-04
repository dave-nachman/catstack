import {
  NumberToken,
  BooleanToken,
  ListToken,
  StackValue,
  Environment,
  Closure
} from "./types";
import { parser } from "./parser";
import { Success } from "parsimmon";
import { apply } from "./apply";

const binaryNumberOperator = <T extends number | boolean>(
  fn: (a: number, b: number) => T
) => ({
  stack,
  environment
}: {
  stack: StackValue[];
  environment: Environment;
}) => {
  if (
    stack.length >= 2 &&
    stack[stack.length - 1].type === "number" &&
    stack[stack.length - 2].type === "number"
  ) {
    const b = stack.pop();
    const a = stack.pop();
    const c = fn((a as NumberToken).value, (b as NumberToken).value);
    return {
      stack: stack.concat([
        typeof c === "number"
          ? { type: "number", value: c }
          : { type: "boolean", value: c as boolean }
      ]),
      environment
    };
  } else {
    throw new Error("Invalid stack - two numbers were expected");
  }
};

const binaryBooleanOperator = <T extends number | boolean>(
  fn: (a: boolean, b: boolean) => T
) => ({
  stack,
  environment
}: {
  stack: StackValue[];
  environment: Environment;
}) => {
  if (
    stack.length >= 2 &&
    stack[stack.length - 1].type === "boolean" &&
    stack[stack.length - 2].type === "boolean"
  ) {
    const b = stack.pop()!;
    const a = stack.pop()!;
    const c = fn((a as BooleanToken).value, (b as BooleanToken).value);
    return {
      stack: stack.concat([
        typeof c === "number"
          ? { type: "number", value: c }
          : { type: "boolean", value: c as boolean }
      ]),
      environment
    };
  } else {
    throw new Error("Invalid stack - two booleans were expected");
  }
};

// define a function using catstack, not native code
const catstack = (input: string): ListToken => {
  return (parser.parse(input) as Success<ListToken[]>).value[0];
};

export const defaultEnvironment: Environment = {
  add: binaryNumberOperator((a, b) => a + b),
  sub: binaryNumberOperator((a, b) => a - b),
  mult: binaryNumberOperator((a, b) => a * b),
  div: binaryNumberOperator((a, b) => a / b),

  eq: binaryNumberOperator((a, b) => a == b),
  gt: binaryNumberOperator((a, b) => a > b),
  lt: binaryNumberOperator((a, b) => a < b),

  and: binaryBooleanOperator((a, b) => a && b),
  or: binaryBooleanOperator((a, b) => a || b),
  dup: ({ stack, environment }) => {
    if (stack.length) {
      return {
        stack: stack.concat([stack.slice(-1)[0]]),
        environment
      };
    } else {
      throw new Error(
        "Invalid stack - there must be at least one value on the stack"
      );
    }
  },

  if: ({ stack, environment }) => {
    if (stack.length >= 3) {
      const falseValue = stack.pop()!;
      const trueValue = stack.pop()!;
      const condition = stack.pop()!;

      return apply({
        stack: stack.concat([
          condition.value === false ? falseValue : trueValue
        ]),
        environment
      });
    } else {
      throw new Error("Invalid stack - expected at least 3 values");
    }
  },
  def: ({ stack, environment }) => {
    if (stack.length >= 2) {
      const value = stack.pop()!;
      const identifier = stack.pop()!;
      if (
        identifier.type === "list" &&
        identifier.value.length === 1 &&
        identifier.value[0].type === "name"
      ) {
        return {
          stack,
          environment: {
            ...environment,
            [String(identifier.value[0].value)]: value
          }
        };
      } else {
        throw new Error("Identifier must be a list with one name");
      }
    } else {
      throw new Error("Invalid stack");
    }
  },
  apply,
  close: ({ stack, environment }) => {
    if (stack.length && stack[stack.length - 1].type === "list") {
      const list = stack.pop();

      const closure: Closure = {
        type: "closure",
        value: list as ListToken,
        env: { ...environment }
      };
      return {
        stack: stack.concat([closure]),
        environment
      };
    } else {
      throw new Error("Invalid stack - a list was expected");
    }
  },
  swap: ({ stack, environment }) => {
    if (stack.length >= 2) {
      return {
        stack: stack
          .slice(0, stack.length - 2)
          .concat([stack[stack.length - 1], stack[stack.length - 2]]),
        environment
      };
    } else {
      throw new Error("Invalid stack - at least two values were expected");
    }
  },
  rot: ({ stack, environment }) => {
    if (stack.length >= 3) {
      const a = stack.pop()!;
      const b = stack.pop()!;
      const c = stack.pop()!;
      return {
        stack: stack.concat([b, c, a]),
        environment
      };
    } else {
      throw new Error("Invalid stack - at least three values were expected");
    }
  },
  wipe: ({ environment }) => {
    return {
      stack: [],
      environment
    };
  },
  drop: ({ stack, environment }) => {
    if (stack.length) {
      return {
        stack: stack.slice(0, stack.length - 1),
        environment
      };
    } else {
      throw new Error("Invalid stack - can't pop an empty stack");
    }
  },
  map: ({ stack, environment }) => {
    if (stack.length >= 2) {
      const fn = stack.pop()!;
      const list = stack.pop()!;

      if (fn.type === "list" && list.type === "list") {
        const result = list.value.map(value => {
          const nextStack = apply({
            stack: stack.concat([value, fn]),
            environment
          }).stack;
          return nextStack[nextStack.length - 1];
        });

        const nextToken: ListToken = { type: "list", value: result };

        return {
          stack: stack.concat([nextToken]),
          environment
        };
      } else {
        throw new Error("Invalid stack - map takes two lists");
      }
    } else {
      throw new Error("Invalid stack - at least two values were expected");
    }
  },
  first: ({ stack, environment }) => {
    if (stack.length && stack[stack.length - 1].type === "list") {
      const list = stack.pop() as ListToken;
      if (list.value.length === 0) {
        throw new Error("Can't call first on empty list");
      }

      const first = list.value[list.value.length - 1];
      return {
        stack: stack.concat([first]),
        environment
      };
    } else {
      throw new Error("Invalid stack - expecting a list");
    }
  },
  second: catstack("[tail first]"),
  tail: ({ stack, environment }) => {
    if (stack.length && stack[stack.length - 1].type === "list") {
      const list = stack.pop() as ListToken;
      const tail = list.value.slice(0, list.value.length - 1);
      return {
        stack: stack.concat([{ type: "list", value: tail }]),
        environment
      };
    } else {
      throw new Error("Invalid stack - expecting a list");
    }
  },
  push: ({ stack, environment }) => {
    if (stack.length >= 2 && stack[stack.length - 2].type === "list") {
      const item = stack.pop()!;
      const list = stack.pop() as ListToken;

      return {
        stack: stack.concat([
          {
            type: "list",
            value: list.value.concat([item])
          }
        ]),
        environment
      };
    } else {
      throw new Error(
        "Invalid stack - expected a stack with a minimal depth of 2 and a list second from top"
      );
    }
  },
  pop: catstack("[dup tail swap first]")
};
