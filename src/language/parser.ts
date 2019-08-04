import * as P from "parsimmon";
import {
  NameToken,
  NumberToken,
  BooleanToken,
  ListToken,
  LookupToken,
  StringToken,
  Token
} from "./types";

const nameRegex = /[a-z]([a-z]|[0-9]|-|\?)*/;

const name: P.Parser<NameToken> = P.regexp(nameRegex).map(value => ({
  type: "name" as const,
  value
}));

const lookup: P.Parser<LookupToken> = P.string("@").then(
  P.regexp(nameRegex).map(value => ({
    type: "lookup" as const,
    value
  }))
);

const number: P.Parser<NumberToken> = P.regex(/-?[0-9]+\.?[0-9]*/).map(
  value => ({
    type: "number" as const,
    value: Number(value)
  })
);

const boolean: P.Parser<BooleanToken> = P.string("true")
  .or(P.string("false"))
  .map(value => ({
    type: "boolean" as const,
    value: value === "true"
  }));

const list: P.Parser<ListToken> = P.string("[")
  .then(P.optWhitespace)
  .then(P.lazy(() => parser))
  .skip(P.string("]"))
  .map(value => ({
    type: "list" as const,
    value
  }));

const string: P.Parser<StringToken> = P.regex(/"(.*)"/, 1).map(value => ({
  type: "string" as const,
  value
}));

const comment: P.Parser<undefined> = P.string("#")
  .skip(P.noneOf("\n").many())
  .map(() => undefined);

export const parser: P.Parser<Token[]> = P.alt(
  list,
  string,
  boolean,
  name,
  lookup,
  number,
  comment
)
  .sepBy(P.regex(/( )+/))
  // filter comments
  .map(tokens => tokens.filter(token => !!token))
  .sepBy(P.regex(/\n+/))
  .map(nestedTokens =>
    // flatten
    nestedTokens.reduce((result, xs) => result.concat(xs), [])
  );
