package main

import (
  "github.com/blebbit/authr/examples/flexicon/design"
  "github.com/blebbit/flexicon/codegen/gen"
)

Generator: gen.Generator & {
  @gen()

  In: {
    Lexicon: [for _, d in design { d }]
  }
}
