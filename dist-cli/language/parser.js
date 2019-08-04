"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var P = __importStar(require("parsimmon"));
var nameRegex = /[a-z]([a-z]|[0-9]|-|\?)*/;
var name = P.regexp(nameRegex).map(function (value) { return ({
    type: "name",
    value: value
}); });
var lookup = P.string("@").then(P.regexp(nameRegex).map(function (value) { return ({
    type: "lookup",
    value: value
}); }));
var number = P.regex(/-?[0-9]+\.?[0-9]*/).map(function (value) { return ({
    type: "number",
    value: Number(value)
}); });
var boolean = P.string("true")
    .or(P.string("false"))
    .map(function (value) { return ({
    type: "boolean",
    value: value === "true"
}); });
var list = P.string("[")
    .then(P.optWhitespace)
    .then(P.lazy(function () { return exports.parser; }))
    .skip(P.string("]"))
    .map(function (value) { return ({
    type: "list",
    value: value
}); });
var string = P.regex(/"(.*)"/, 1).map(function (value) { return ({
    type: "string",
    value: value
}); });
var comment = P.string("#")
    .skip(P.noneOf("\n").many())
    .map(function () { return undefined; });
exports.parser = P.alt(list, string, boolean, name, lookup, number, comment)
    .sepBy(P.regex(/( )+/))
    // filter comments
    .map(function (tokens) { return tokens.filter(function (token) { return !!token; }); })
    .sepBy(P.regex(/\n+/))
    .map(function (nestedTokens) {
    // flatten
    return nestedTokens.reduce(function (result, xs) { return result.concat(xs); }, []);
});
