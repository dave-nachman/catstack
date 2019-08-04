import { parser } from "./parser";
import { prettyPrint } from "./prettyPrint";
import { Token } from "./types";

test("parse a number", () => {
  const parseResult = parser.parse("12");
  expect(parseResult.status).toBe(true);
  expect(parseResult.status && parseResult.value).toEqual([
    {
      type: "number",
      value: 12
    }
  ]);
});

const testInput = "2 [] name @lookup";
const testOutput: Token[] = [
  { type: "number", value: 2 },
  { type: "list", value: [] },
  { type: "name", value: "name" },
  { type: "lookup", value: "lookup" }
];

test("parse a series of inputs", () => {
  const parseResult = parser.parse(testInput);
  expect(parseResult.status && parseResult.value).toEqual(testOutput);
});

test("pretty printer", () => {
  expect(prettyPrint(testOutput)).toBe(testInput);
});
