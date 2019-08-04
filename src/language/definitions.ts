export const definitions: { [key: string]: string } = {
  add: "add two numbers",
  sub: "subtract the second number from the first",
  mult: "multiply two numbers",
  div: "divide two numbers",
  def:
    "given a quoted name (list of a name) and a value, set the name to the value in the environment",
  close: "given a list, creating a closure using the current environment",
  eq: "equals",
  gt: "greater than",
  lt: "less than",
  dup: "duplicate the value on the top of the stack",
  if:
    "if the first value is true, apply the second value, otherwise apply the third value",
  apply: "evaluate a list",
  swap: "swap the top and 2nd from top values on the stack",
  rot: "given values a b c on the stack, rotate such that the stack is b a c",
  wipe: "clear the stack",
  drop: "drop the top value on the stack",
  map:
    "given a list of values, apply a list to each value of the list (given a stack with the value placed on top)",
  push:
    "given a list and a value, add the value to the list and place on top of stack",
  pop:
    "given a list, pop off the last value, and place the updated list and value onto the stack"
};
