"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("./parser");
var prettyPrint_1 = require("./prettyPrint");
test("parse a number", function () {
    var parseResult = parser_1.parser.parse("12");
    expect(parseResult.status).toBe(true);
    expect(parseResult.status && parseResult.value).toEqual([
        {
            type: "number",
            value: 12
        }
    ]);
});
var testInput = "2 [] name @lookup";
var testOutput = [
    { type: "number", value: 2 },
    { type: "list", value: [] },
    { type: "name", value: "name" },
    { type: "lookup", value: "lookup" }
];
test("parse a series of inputs", function () {
    var parseResult = parser_1.parser.parse(testInput);
    expect(parseResult.status && parseResult.value).toEqual(testOutput);
});
test("pretty printer", function () {
    expect(prettyPrint_1.prettyPrint(testOutput)).toBe(testInput);
});
