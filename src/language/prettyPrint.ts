import { StackValue } from "./types";

export const prettyPrint = (value: StackValue | StackValue[]): string => {
  if (Array.isArray(value)) {
    return value.map(prettyPrint).join(" ");
  }

  if (value.type === "closure") {
    return `${prettyPrint(value.value)}*`;
  }

  switch (value.type) {
    case "lookup": {
      return `@${value.value}`;
    }
    case "string": {
      return `"${value.value}"`;
    }
    case "number": {
      return `${value.value}`;
    }
    case "name": {
      return `${value.value}`;
    }
    case "boolean": {
      return `${value.value}`;
    }
    case "list": {
      return `[${prettyPrint(value.value)}]`;
    }
  }
};
