import minimist from "minimist";

import main from "./main";
import { ValueMap } from "./ValueMap";

let args: any = minimist(process.argv.slice(2));
let config = {};
if (args.c) {
  config = require(args.c);
}
if (args.i) {
  args.i = args.i.split(",");
}
if (args.e) {
  args.e = args.e.split(",");
}

args = { ...config, ...args };

main(args)
  .then((valueMap: ValueMap) => {
    valueMap.print();
  })
  .catch((err: Error) => {
    throw err;
  });
