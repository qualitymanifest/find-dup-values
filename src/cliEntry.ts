import minimist from "minimist";

import main from "./main";
import { ValueMap } from "./ValueMap";

let args: any = minimist(process.argv.slice(2), {
  alias: {
    p: "path",
    i: "ignoreStrings",
    I: "ignoreGlobs",
    e: "extensions"
  }
});
let config = {};
if (args.c) {
  config = require(args.c);
}
if (args.ignoreStrings) {
  args.ignoreStrings = args.ignoreStrings.split(",");
}
if (args.ignoreGlobs) {
  args.ignoreGlobs = args.ignoreGlobs.split(",");
}
if (args.extensions) {
  args.extensions = args.extensions.split(",");
}

args = { ...config, ...args };

main(args)
  .then((valueMap: ValueMap) => {
    valueMap.print();
  })
  .catch((err: Error) => {
    throw err;
  });
