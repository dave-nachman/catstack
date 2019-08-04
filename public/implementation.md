# Implementation

Catstack is implemented in [TypeScript](http://typescriptlang.org), and uses [Parsimmon](https://github.com/jneen/parsimmon) for parsing.

TypeScript was chosen as having a first-class interactive web experience was an important aspect of the educational goals of the language, and writing the language in JavaScript or TypeScript makes it easier to support that web-based experience.

The implementation is meant to emphasize clarity, rather than performance, given the goals of the language.

The library exposes a type `Interpreter` which has a stack, environment, and an `interpret` function to process input and immutably produce a new interpreter:

```
export interface Interpreter {
  stack: Token[];
  environment: Environment;
  interpret: (input: string) => Interpreter;
}
```

### Interactive Web environment

