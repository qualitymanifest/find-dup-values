import minimist from "minimist";

const main = require("../main");
import { ValueJSON } from "../ValueMap";

const IS_JEST = !!process.env.JEST_WORKER_ID;

const print = (valueJSON: ValueJSON) => {
  valueJSON.values.forEach(v => {
    console.log(`${typeof v.data}:`.cyan.bold + `${v.data}`.bgCyan);
    for (let [path, amount] of Object.entries(v.paths)) {
      console.log(`    ${path} ` + `${amount}`.yellow.bold);
    }
    console.log(`    TOTAL: ${v.total}`.red.bold);
  });
};

const cliEntry = () => {
  let args: any = minimist(process.argv.slice(2), {
    alias: {
      p: "path",
      e: "extensions",
      i: "ignore",
      m: "min"
    }
  });
  let config = {};
  if (args.c) {
    config = require(args.c);
  }
  if (args.extensions) {
    args.extensions = args.extensions.split(",");
  }
  if (args.ignore) {
    args.ignore = args.ignore.split(",");
  }
  if (args.min) {
    args.min = Number(args.min);
  }

  args = { ...config, ...args };

  if (IS_JEST) return args;

  main(args)
    .then((valueJSON: ValueJSON) => {
      print(valueJSON);
    })
    .catch((err: Error) => {
      throw err;
    });
};

if (!IS_JEST) {
  cliEntry();
}

module.exports = cliEntry;
