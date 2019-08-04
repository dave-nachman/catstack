# Design choices

Catstack aims to be very minimal and consistent, in order to emphasize the fundamental characteristics of the stack-oriented programming model. It is designed to be what Scheme is intended to be compared to Lisp — a simple language that has only an essential set of concepts and distinctions.

### Consistency of syntax

Everything uses postfix evaluation, including defining new variables (e.g. `[x] 20 def`). All names are immediately evaluated.

### Unification of functions, quotations, and lists

Some stack-based programming languages have different concepts and syntax for functions, quotations, and lists.

For example, PostScript has the following:

```
{dup mul}    % procedure
\name        % name that won't be evaluated; instead pushed on stack
[1 2 3]      % array
```

Catstack has a single construct for each of these use cases, as list serve as a general mechanism for quotation. A list serves as the body of a function. Names are represented for definitional purposes as a list of a single name, rather than a special quoted value.

```
[dup mult]   # list serving as function definition
[square]       # list of a single name
[1 2 3]      # list of number values
```

Unifying these use cases together with a single construct simplifies the language, and secondarily may also promote metaprogramming

### Consistent evaluation of names

Catstack tries to evaluate a name regardless of whether it points to a list (i.e. function definition) or a literal value. If it is a literal value, an error is thrown. Catstack instead has a lookup operation (`@x` - place the literal value of `x` on the stack) which works the same regardless of whether the value is a list or literal.

By comparison, some other stack-based languages (e.g. Factor) will evaluate the value if it is a function definition but will push the literal value onto the stack if not.

Catstack doesn't change its behavior depending on whether the value is a list or literal in order to promote simple and consistent rules of evaluation.
