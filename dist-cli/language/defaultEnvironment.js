"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("./parser");
var apply_1 = require("./apply");
var binaryNumberOperator = function (fn) { return function (_a) {
    var stack = _a.stack, environment = _a.environment;
    if (stack.length >= 2 &&
        stack[stack.length - 1].type === "number" &&
        stack[stack.length - 2].type === "number") {
        var b = stack.pop();
        var a = stack.pop();
        var c = fn(a.value, b.value);
        return {
            stack: stack.concat([
                typeof c === "number"
                    ? { type: "number", value: c }
                    : { type: "boolean", value: c }
            ]),
            environment: environment
        };
    }
    else {
        throw new Error("Invalid stack - two numbers were expected");
    }
}; };
var binaryBooleanOperator = function (fn) { return function (_a) {
    var stack = _a.stack, environment = _a.environment;
    if (stack.length >= 2 &&
        stack[stack.length - 1].type === "boolean" &&
        stack[stack.length - 2].type === "boolean") {
        var b = stack.pop();
        var a = stack.pop();
        var c = fn(a.value, b.value);
        return {
            stack: stack.concat([
                typeof c === "number"
                    ? { type: "number", value: c }
                    : { type: "boolean", value: c }
            ]),
            environment: environment
        };
    }
    else {
        throw new Error("Invalid stack - two booleans were expected");
    }
}; };
// define a function using catstack, not native code
var catstack = function (input) {
    return parser_1.parser.parse(input).value[0];
};
exports.defaultEnvironment = {
    add: binaryNumberOperator(function (a, b) { return a + b; }),
    sub: binaryNumberOperator(function (a, b) { return a - b; }),
    mult: binaryNumberOperator(function (a, b) { return a * b; }),
    div: binaryNumberOperator(function (a, b) { return a / b; }),
    eq: binaryNumberOperator(function (a, b) { return a == b; }),
    gt: binaryNumberOperator(function (a, b) { return a > b; }),
    lt: binaryNumberOperator(function (a, b) { return a < b; }),
    and: binaryBooleanOperator(function (a, b) { return a && b; }),
    or: binaryBooleanOperator(function (a, b) { return a || b; }),
    dup: function (_a) {
        var stack = _a.stack, environment = _a.environment;
        if (stack.length) {
            return {
                stack: stack.concat([stack.slice(-1)[0]]),
                environment: environment
            };
        }
        else {
            throw new Error("Invalid stack - there must be at least one value on the stack");
        }
    },
    if: function (_a) {
        var stack = _a.stack, environment = _a.environment;
        if (stack.length >= 3) {
            var falseValue = stack.pop();
            var trueValue = stack.pop();
            var condition = stack.pop();
            return apply_1.apply({
                stack: stack.concat([
                    condition.value === false ? falseValue : trueValue
                ]),
                environment: environment
            });
        }
        else {
            throw new Error("Invalid stack - expected at least 3 values");
        }
    },
    def: function (_a) {
        var _b;
        var stack = _a.stack, environment = _a.environment;
        if (stack.length >= 2) {
            var value = stack.pop();
            var identifier = stack.pop();
            if (identifier.type === "list" &&
                identifier.value.length === 1 &&
                identifier.value[0].type === "name") {
                return {
                    stack: stack,
                    environment: __assign({}, environment, (_b = {}, _b[String(identifier.value[0].value)] = value, _b))
                };
            }
            else {
                throw new Error("Identifier must be a list with one name");
            }
        }
        else {
            throw new Error("Invalid stack");
        }
    },
    apply: apply_1.apply,
    close: function (_a) {
        var stack = _a.stack, environment = _a.environment;
        if (stack.length && stack[stack.length - 1].type === "list") {
            var list = stack.pop();
            var closure = {
                type: "closure",
                value: list,
                env: __assign({}, environment)
            };
            return {
                stack: stack.concat([closure]),
                environment: environment
            };
        }
        else {
            throw new Error("Invalid stack - a list was expected");
        }
    },
    swap: function (_a) {
        var stack = _a.stack, environment = _a.environment;
        if (stack.length >= 2) {
            return {
                stack: stack
                    .slice(0, stack.length - 2)
                    .concat([stack[stack.length - 1], stack[stack.length - 2]]),
                environment: environment
            };
        }
        else {
            throw new Error("Invalid stack - at least two values were expected");
        }
    },
    rot: function (_a) {
        var stack = _a.stack, environment = _a.environment;
        if (stack.length >= 3) {
            var a = stack.pop();
            var b = stack.pop();
            var c = stack.pop();
            return {
                stack: stack.concat([b, c, a]),
                environment: environment
            };
        }
        else {
            throw new Error("Invalid stack - at least three values were expected");
        }
    },
    wipe: function (_a) {
        var environment = _a.environment;
        return {
            stack: [],
            environment: environment
        };
    },
    drop: function (_a) {
        var stack = _a.stack, environment = _a.environment;
        if (stack.length) {
            return {
                stack: stack.slice(0, stack.length - 1),
                environment: environment
            };
        }
        else {
            throw new Error("Invalid stack - can't pop an empty stack");
        }
    },
    map: function (_a) {
        var stack = _a.stack, environment = _a.environment;
        if (stack.length >= 2) {
            var fn_1 = stack.pop();
            var list = stack.pop();
            if (fn_1.type === "list" && list.type === "list") {
                var result = list.value.map(function (value) {
                    var nextStack = apply_1.apply({
                        stack: stack.concat([value, fn_1]),
                        environment: environment
                    }).stack;
                    return nextStack[nextStack.length - 1];
                });
                var nextToken = { type: "list", value: result };
                return {
                    stack: stack.concat([nextToken]),
                    environment: environment
                };
            }
            else {
                throw new Error("Invalid stack - map takes two lists");
            }
        }
        else {
            throw new Error("Invalid stack - at least two values were expected");
        }
    },
    first: function (_a) {
        var stack = _a.stack, environment = _a.environment;
        if (stack.length && stack[stack.length - 1].type === "list") {
            var list = stack.pop();
            var first = list.value[list.value.length - 1];
            return {
                stack: stack.concat([first]),
                environment: environment
            };
        }
        else {
            throw new Error("Invalid stack - expecting a list");
        }
    },
    second: catstack("[tail first]"),
    tail: function (_a) {
        var stack = _a.stack, environment = _a.environment;
        if (stack.length && stack[stack.length - 1].type === "list") {
            var list = stack.pop();
            var tail = list.value.slice(0, list.value.length - 1);
            return {
                stack: stack.concat([{ type: "list", value: tail }]),
                environment: environment
            };
        }
        else {
            throw new Error("Invalid stack - expecting a list");
        }
    },
    push: function (_a) {
        var stack = _a.stack, environment = _a.environment;
        if (stack.length >= 2 && stack[stack.length - 2].type === "list") {
            var item = stack.pop();
            var list = stack.pop();
            return {
                stack: stack.concat([
                    {
                        type: "list",
                        value: list.value.concat([item])
                    }
                ]),
                environment: environment
            };
        }
        else {
            throw new Error("Invalid stack - expected a stack with a minimal depth of 2 and a list second from top");
        }
    },
    pop: catstack("[dup tail swap first]")
};
