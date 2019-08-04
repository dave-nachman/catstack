"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettyPrint = function (value) {
    if (Array.isArray(value)) {
        return value.map(exports.prettyPrint).join(" ");
    }
    if (value.type === "closure") {
        return exports.prettyPrint(value.value) + "*";
    }
    switch (value.type) {
        case "lookup": {
            return "@" + value.value;
        }
        case "string": {
            return "\"" + value.value + "\"";
        }
        case "number": {
            return "" + value.value;
        }
        case "name": {
            return "" + value.value;
        }
        case "boolean": {
            return "" + value.value;
        }
        case "list": {
            return "[" + exports.prettyPrint(value.value) + "]";
        }
    }
};
