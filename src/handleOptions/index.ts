import minimist from "minimist";
import { existsSync } from "fs";
import gtr from "glob-to-regexp";

import {
  BAD_PATH_ERR,
  NO_PATH_ERR,
  NO_EXT_ERR,
  DEFAULT_IGNORE
} from "../constants";

const convertGlobs = (globs: string[]): RegExp[] => {
  if (!globs) return [];
  return globs.map(glob => gtr(glob));
};

export const handleOptions = (config: any) => {
  const args = minimist(process.argv.slice(2));
  const errs = [];
  // CLI args take precedent over config file
  const options = {
    p: args.p ? args.p : config ? config.p : "",
    i: args.i ? args.i.split(",") : config.i,
    I: args.I ? convertGlobs(args.I.split(",")) : convertGlobs(config.I),
    e: args.e ? args.e.split(",") : config.e
  };
  if (!options.p) {
    // path cannot be omitted
    errs.push(NO_PATH_ERR);
  } else if (!existsSync(options.p)) {
    errs.push(BAD_PATH_ERR);
  }
  if (options.i) {
    // names to ignore can be omitted
    options.i.push(...DEFAULT_IGNORE);
  } else {
    options.i = DEFAULT_IGNORE;
  }
  if (!options.e) {
    // extensions cannot be omitted
    errs.push(NO_EXT_ERR);
  }
  if (errs.length) {
    const err = new Error(errs.join("\n"));
    err.stack = ""; // Not needed here, just gets in the way
    throw err;
  }
  return options;
};
