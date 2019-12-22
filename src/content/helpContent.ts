export const helpContent = `
Welcome to the 1perfect language tutorial

  • more information at https://1perfect.org/
  • suggested file extension is *.1p

Syntax:
  \\n (or) ; ........ terminate statement
  "hello" .......... enter a string value
  1 (or) 1.23 ...... enter a base-10 number
  2x10 (or) 8x10 ... enter number with specific base
  # ................ enters a comment for the current context
  <context> ........ enters context as new global
  name<1> .......... sets "name" to 1 in current context
  { name } ......... selects "name" from current context
                     (all queries are automatically wrapped in { },
                     so you don't need to add these at the top
                     or you will create a double-nested query)
  ( name ) ......... run and return last value, but don't extract
  [ 1 ; 2 ; 3 ] .... create a list, separate with ; or \\n

Language reserved keywords:
  code ...... introspect syntax
  crash ..... immediately terminate execution
  null ...... i.e. void / null / undefined / empty
  on ........ i.e. boolean true
  no ........ i.e. boolean false
  seek ...... navigate to location
  up ........ enters parent context as new global
              (will crash if already at root)

Default global values:
  now ....... current unix time in ms, i.e. ${Date.now()}
  parent .... parent context, if not at root
  process ... { id<...>, start<...> }

Language features:
`.trim();
