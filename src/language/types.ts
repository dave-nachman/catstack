export interface NameToken {
  type: "name";
  value: string;
}

export interface LookupToken {
  type: "lookup";
  value: string;
}

export interface NumberToken {
  type: "number";
  value: number;
}

export interface BooleanToken {
  type: "boolean";
  value: boolean;
}

export interface StringToken {
  type: "string";
  value: string;
}

export interface ListToken {
  type: "list";
  value: StackValue[];
}

export interface StringToken {
  type: "string";
  value: string;
}

export type Token =
  | NameToken
  | LookupToken
  | NumberToken
  | BooleanToken
  | StringToken
  | ListToken
  | StringToken;

export type DynamicValue = Token;
export type Closure = { type: "closure"; value: ListToken; env: Environment };

export type BuiltInFunction = (input: {
  stack: StackValue[];
  environment: Environment;
}) => { stack: StackValue[]; environment: Environment };

export type StackValue = DynamicValue | Closure;
export type EnvValue = BuiltInFunction | StackValue;

export type Environment = { [key: string]: EnvValue };
