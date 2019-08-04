import { createInterpreter } from "./interpreter";
import { prettyPrint } from "./prettyPrint";

const interpreter = createInterpreter();

const interpret = (input: string) =>
  prettyPrint(interpreter.interpret(input).stack);

test("first", () => {
  expect(interpret("[1 2 3] first")).toBe("3");
});

test("tail", () => {
  expect(interpret("[1 2 3] tail")).toBe("[1 2]");
});

test("map", () => {
  expect(interpret("1 [1 2 3] [add] map")).toBe("1 [2 3 4]");
});

test("def & lookup", () => {
  expect(interpret("'x 1 def @x")).toBe("1");
});

test("swap", () => {
  expect(interpret("1 2 swap")).toBe("2 1");
});

test("wipe", () => {
  expect(interpret("1 2 3 wipe")).toBe("");
});

test("apply", () => {
  expect(interpret("[1 2 3] apply")).toBe("1 2 3");
});

test("drop", () => {
  expect(interpret("1 2 3 drop")).toBe("1 2");
});

test("if", () => {
  expect(interpret("1 2 lt [1] [0] if")).toBe("1");
  expect(interpret("1 2 gt [1] [0] if")).toBe("0");
});

test("dup", () => {
  expect(interpret("1 dup")).toBe("1 1");
});
