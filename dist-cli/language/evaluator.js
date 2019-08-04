"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluate = function (nextToken, stack, environment) {
    if (nextToken.type === "name") {
        if (environment[nextToken.value]) {
            var value = environment[nextToken.value];
            // is it a token or built-in function?
            if (typeof value === "object") {
                if (value.type === "list") {
                    // evaluate by reducing over the values in the list
                    return value.value.reduce(function (_a, token) {
                        var stack = _a.stack, environment = _a.environment;
                        return exports.evaluate(token, stack, environment);
                    }, { stack: stack, environment: environment });
                }
                else if (value.type === "lookup" &&
                    // is it a catstack-defined value, not a built-in?
                    typeof environment[value.value] === "object") {
                    return {
                        stack: stack.concat([environment[value.value]]),
                        environment: environment
                    };
                }
                else if (value.type === "lookup") {
                    throw new Error("Can't lookup a built-in function");
                }
                else if (value.type === "closure") {
                    var result = value.value.value.reduce(function (_a, token) {
                        var stack = _a.stack, environment = _a.environment;
                        return exports.evaluate(token, stack, environment);
                    }, 
                    // use the environment that is captured in the closure
                    { stack: stack, environment: value.env });
                    // only return the stack from the evaluated closure
                    return {
                        stack: result.stack,
                        environment: environment
                    };
                }
                else {
                    throw new Error("A literal value cannot be evaluated");
                }
            }
            else {
                // built-in function
                return value({ stack: stack, environment: environment });
            }
        }
        else {
            throw new Error(nextToken.value + " is not in the environment");
        }
    }
    else if (nextToken.type === "lookup") {
        if (typeof environment[nextToken.value] === "object") {
            return {
                stack: stack.concat([environment[nextToken.value]]),
                environment: environment
            };
        }
        else if (!environment[nextToken.value]) {
            throw new Error(nextToken.value + " not found in environment");
        }
        else {
            throw new Error("Can't look up a built-in");
        }
    }
    else {
        return {
            stack: stack.concat([nextToken]),
            environment: environment
        };
    }
};
