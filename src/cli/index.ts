import repl from "repl";
import fs from "fs";

import commander from "commander";
import { createInterpreter } from "../language/interpreter";
import { prettyPrint } from "../language/prettyPrint";

commander.option("-c, --cmd <cmd>", "add pepper");

export const start = () => {
  commander.parse(process.argv);

  let interpreter = createInterpreter();

  // passed in program as string
  if (commander.cmd) {
    const program = commander.cmd as string;
    interpreter = interpreter.interpret(program);
    console.log(prettyPrint(interpreter.stack));

    // filename
  } else if (commander.args.length) {
    const program = fs.readFileSync(commander.args[0], { encoding: "utf-8" });
    interpreter = interpreter.interpret(program);
    console.log(prettyPrint(interpreter.stack));

    // repl
  } else {
    const replEval: repl.REPLEval = (cmd, context, filename, callback) => {
      try {
        interpreter = interpreter.interpret(cmd.trim());
        callback(null, prettyPrint(interpreter.stack));
      } catch (e) {
        callback(e, null);
      }
    };

    repl.start({ prompt: "catstack> ", eval: replEval });
  }
};
