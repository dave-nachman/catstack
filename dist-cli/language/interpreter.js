"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var defaultEnvironment_1 = require("./defaultEnvironment");
var parser_1 = require("./parser");
var evaluator_1 = require("./evaluator");
var ParseError = /** @class */ (function (_super) {
    __extends(ParseError, _super);
    function ParseError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ParseError;
}(Error));
exports.ParseError = ParseError;
var interpret = function (input, stack, environment) {
    var parseResult = parser_1.parser.parse(input);
    if (parseResult.status) {
        var result_1 = parseResult.value.reduce(function (_a, token) {
            var stack = _a.stack, environment = _a.environment;
            return evaluator_1.evaluate(token, stack.slice(), // built-in functions might mutably pop the stack, so pass in shallow copy
            environment);
        }, { stack: stack, environment: environment });
        return __assign({}, result_1, { interpret: function (input) {
                return interpret(input, result_1.stack, result_1.environment);
            } });
    }
    else {
        throw new ParseError("\"" + input + "\" is not a valid input");
    }
};
exports.createInterpreter = function (customEnvironment) {
    var stack = [];
    var environment = __assign({}, defaultEnvironment_1.defaultEnvironment, customEnvironment);
    return {
        interpret: function (input, customEnvironment) {
            return interpret(input, stack, __assign({}, environment, customEnvironment));
        },
        stack: stack,
        environment: environment
    };
};
