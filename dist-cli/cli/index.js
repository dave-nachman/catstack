"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var repl_1 = __importDefault(require("repl"));
var fs_1 = __importDefault(require("fs"));
var commander_1 = __importDefault(require("commander"));
var interpreter_1 = require("../language/interpreter");
var prettyPrint_1 = require("../language/prettyPrint");
commander_1.default.option("-c, --cmd <cmd>", "add pepper");
exports.start = function () {
    commander_1.default.parse(process.argv);
    var interpreter = interpreter_1.createInterpreter();
    // passed in program as string
    if (commander_1.default.cmd) {
        var program = commander_1.default.cmd;
        interpreter = interpreter.interpret(program);
        console.log(prettyPrint_1.prettyPrint(interpreter.stack));
        // filename
    }
    else if (commander_1.default.args.length) {
        var program = fs_1.default.readFileSync(commander_1.default.args[0], { encoding: "utf-8" });
        interpreter = interpreter.interpret(program);
        console.log(prettyPrint_1.prettyPrint(interpreter.stack));
        // repl
    }
    else {
        var replEval = function (cmd, context, filename, callback) {
            try {
                interpreter = interpreter.interpret(cmd.trim());
                callback(null, prettyPrint_1.prettyPrint(interpreter.stack));
            }
            catch (e) {
                callback(e, null);
            }
        };
        repl_1.default.start({ prompt: "catstack> ", eval: replEval });
    }
};
