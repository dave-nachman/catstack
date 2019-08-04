"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var evaluator_1 = require("./evaluator");
exports.apply = function (_a) {
    var stack = _a.stack, environment = _a.environment;
    if (stack.length >= 1) {
        var values = stack.pop();
        if (values.type !== "list") {
            throw new Error("Only a list value can be applied");
        }
        else {
            // take each value in the list and reduce over it, evaluating each values
            return values.value.reduce(function (_a, value) {
                var stack = _a.stack, environment = _a.environment;
                return evaluator_1.evaluate(value, stack, environment);
            }, { stack: stack, environment: environment });
        }
    }
    else {
        throw new Error("Invalid stack - a list was expected");
    }
};
