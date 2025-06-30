package main

import (
  "github.com/blebbit/authr/examples/flexicon/design"
  "github.com/blebbit/flexicon/codegen/gen"
)

Generator: gen.Generator & {
  @gen()

  In: {
    Lexicon: [for _, d in design.lexicon {d}]
    // Lexicon: list.FlattenN([
    //   for _, d in design.groups {d},
    //   for _, d in design.folders {d},
    //   for _, d in design.pages {d},
    // ], 1)
  }
}
