import minimist from "minimist";

const main = require("../main");
import { ValueMap } from "../ValueMap";

const IS_JEST = !!process.env.JEST_WORKER_ID;

const cliEntry = () => {
  let args: any = minimist(process.argv.slice(2), {
    alias: {
      p: "path",
      i: "ignore",
      e: "extensions"
    }
  });
  let config = {};
  if (args.c) {
    config = require(args.c);
  }
  if (args.ignore) {
    args.ignore = args.ignore.split(",");
  }
  if (args.extensions) {
    args.extensions = args.extensions.split(",");
  }

  args = { ...config, ...args };

  if (IS_JEST) return args;

  main(args)
    .then((valueMap: ValueMap) => {
      valueMap.print();
    })
    .catch((err: Error) => {
      throw err;
    });
};

if (!IS_JEST) {
  cliEntry();
}

module.exports = cliEntry;
