# Catstack

Catstack is a [concatenative-](https://en.wikipedia.org/wiki/Concatenative_programming_language) and [stack-oriented](https://en.wikipedia.org/wiki/Stack-oriented_programming) programming language, inspired by earlier languages such as [Forth](<https://en.wikipedia.org/wiki/Forth_(programming_language)>) and [PostScript](https://en.wikipedia.org/wiki/PostScript).

It is written in Typescript and has an [interactive, web environment](https://catstack.org)

Catstack is meant to be a simple, toy language, with the goal of helping people explore stack-based programming languages.

As with similar languages, in Catstack a stack is used for passing parameters — literal values are pushed onto a stack and functions pop and/or push values during evaluation.

```
> 2   # value is pushed onto stack
 2

> dup # "dup" is a function which duplicates the value on top of stack
 2 2

> add # "add" pops off two numbers, adds them, and places the result onto the stack
 4
```

In Catstack, everything uses post-fix notation (for example, `2 2 add` is the equivalent of `2 + 2` in most programming languages).

When a literal value is encountered in Catstack, it is pushed onto the stack. When a _name_ (i.e. an identifier in other languages) is encountered, Catstack looks the value of the name up in the _environment_ and tries to evaluate it — it assumes it is a function.

```
> 2 2 add # "add" is looked up in the environment and then evaluated
 4
```

## Defining functions

New functions can be added to the environment by providing the definition of the function as a list:

```
> [square] [dup mult] def
```

In the example above, `[square]` and `[dup mult]` are both lists, which remain unevaluated. `def` associates the value (`[dup mult]`) with the name `square` in the environment. The two lists serve as _quotations_ — wrapping unevaluated values that are used by the `def` function.

```
> 2 square
 4
```

Some functions in the default environment are defined as built-ins (i.e. native code rather than defined as a Catstack list).

Anything in the environment can be redefined including built-in functions — e.g. you can re-define `def`. In that sense, there are no _keywords_ in Catstack (names with special, built-in meaning); every name evaluates to a value in the environment.

## Defining variables

`def` can be used for any type of value. Values other than lists are _literal values_.

```
> [x] 20 def
```

When Catstack see a name it tries to evaluate it. An error is returned if a literal value is attempted to be evaluated

```
> x
Error: A literal value cannot be evaluated
```

To get the value of a _name_, as opposed to evaluating the name, a _lookup_ is used:

```
> @x    # @ means "lookup"
 20
```

Lookups work the same way for functions (i.e. lists) as any other value.

```
> @square
 [dup mult]
```

`apply` evaluates the value on top of the stack (must be a list), so a lookup following by apply is equivalent to normal evaluation:

```
> 2
 2
> @square apply
 4

```

## Manipulating the stack

Writing functions in Catstack often involves manipulating the stack:

```
> 20
 20

> dup
 20 20

> drop
 20

> 2 swap
 2 20
```

## Scoping

By default, Catstack uses _dynamic scoping_ — at evaluation time, functions that reference other names will be evaluated using the current value of the name.

```
> [add-two] [2 add] def

> 1 add-two
 3

> [add] [sub] def # the definition of add is changed to subtract
 3

> add-two # now when we call "add-two" it uses the new value for "add"
 1
```

This is different from most modern programming languages, which typically use _lexical scoping_ - whereby variables resolve to their value at time of definition, not evaluation.

While Catstack is dynamically scoped by default, functions can become lexically scope by calling the `close` function, which creates a _closure_ (function definition wrapped with its environment)

```
> [add-two]
 [add-two]

> [2 add]
 [add-two] [2 add]

> close      # take [2 add] and create a closure
 [add-two] [2 add]*  # closure indicated by asterisk

 > def        # add to the environment

```
