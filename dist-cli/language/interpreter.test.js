"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interpreter_1 = require("./interpreter");
var prettyPrint_1 = require("./prettyPrint");
var interpreter = interpreter_1.createInterpreter();
var interpret = function (input) {
    return prettyPrint_1.prettyPrint(interpreter.interpret(input).stack);
};
test("first", function () {
    expect(interpret("[1 2 3] first")).toBe("3");
});
test("tail", function () {
    expect(interpret("[1 2 3] tail")).toBe("[1 2]");
});
test("map", function () {
    expect(interpret("1 [1 2 3] [add] map")).toBe("1 [2 3 4]");
});
test("def & lookup", function () {
    expect(interpret("'x 1 def @x")).toBe("1");
});
test("swap", function () {
    expect(interpret("1 2 swap")).toBe("2 1");
});
test("wipe", function () {
    expect(interpret("1 2 3 wipe")).toBe("");
});
test("apply", function () {
    expect(interpret("[1 2 3] apply")).toBe("1 2 3");
});
test("drop", function () {
    expect(interpret("1 2 3 drop")).toBe("1 2");
});
test("if", function () {
    expect(interpret("1 2 lt [1] [0] if")).toBe("1");
    expect(interpret("1 2 gt [1] [0] if")).toBe("0");
});
test("dup", function () {
    expect(interpret("1 dup")).toBe("1 1");
});
