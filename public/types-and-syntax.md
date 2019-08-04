# Types & Syntax

### Name

```
> add
```

### List

```
> [1 2 3]
```

### Boolean

```
> true false
```

### Number

```
> 2.3
```

### String

```
> "hello world"
```

### Lookup (syntax)

```
> [x] 10 def

> @x
 10
```

### Closure

Lists that have been turned into a closure (by calling the `close` function) are printed with an asterisk

```
> [2 add] close
  [2 add]*      # asterisk indicates a closure
```

### Comment

```
> 2.3 # this is a comment
```
