import { BuiltInFunction } from "./types";
import { evaluate } from "./evaluator";

export const apply: BuiltInFunction = ({ stack, environment }) => {
  if (stack.length >= 1) {
    const values = stack.pop()!;
    if (values.type !== "list") {
      throw new Error("Only a list value can be applied");
    } else {
      // take each value in the list and reduce over it, evaluating each values
      return values.value.reduce(
        ({ stack, environment }, value) => evaluate(value, stack, environment),
        { stack, environment }
      );
    }
  } else {
    throw new Error("Invalid stack - a list was expected");
  }
};
