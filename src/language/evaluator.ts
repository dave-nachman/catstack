import { Token } from "./types";
import { Environment, StackValue } from "./types";

export const evaluate = (
  nextToken: StackValue,
  stack: StackValue[],
  environment: Environment
): { stack: StackValue[]; environment: Environment } => {
  if (nextToken.type === "name") {
    if (environment[nextToken.value]) {
      const value = environment[nextToken.value];

      // is it a token or built-in function?
      if (typeof value === "object") {
        if (value.type === "list") {
          // evaluate by reducing over the values in the list
          return value.value.reduce(
            ({ stack, environment }, token) =>
              evaluate(token, stack, environment),
            { stack, environment }
          );
        } else if (
          value.type === "lookup" &&
          // is it a catstack-defined value, not a built-in?
          typeof environment[value.value] === "object"
        ) {
          return {
            stack: stack.concat([environment[value.value] as Token]),
            environment
          };
        } else if (value.type === "lookup") {
          throw new Error("Can't lookup a built-in function");
        } else if (value.type === "closure") {
          const result = value.value.value.reduce(
            ({ stack, environment }, token) => {
              return evaluate(token, stack, environment);
            },
            // use the environment that is captured in the closure
            { stack, environment: value.env }
          );

          // only return the stack from the evaluated closure
          return {
            stack: result.stack,
            environment
          };
        } else {
          throw new Error(`A literal value cannot be evaluated`);
        }
      } else {
        // built-in function
        return value({ stack, environment });
      }
    } else {
      throw new Error(`${nextToken.value} is not in the environment`);
    }
  } else if (nextToken.type === "lookup") {
    if (typeof environment[nextToken.value] === "object") {
      return {
        stack: stack.concat([environment[nextToken.value] as Token]),
        environment
      };
    } else if (!environment[nextToken.value]) {
      throw new Error(`${nextToken.value} not found in environment`);
    } else {
      throw new Error("Can't look up a built-in");
    }
  } else {
    return {
      stack: stack.concat([nextToken]),
      environment
    };
  }
};
