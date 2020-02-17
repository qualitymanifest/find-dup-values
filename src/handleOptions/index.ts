import { existsSync } from "fs";
import gtr from "glob-to-regexp";

import {
  BAD_PATH_ERR,
  NO_PATH_ERR,
  NO_EXT_ERR,
  DEFAULT_IGNORE
} from "../constants";

interface Options {
  p: string;
  i: string[];
  e: string[];
}

export interface RawOptions extends Options {
  I: string[];
}

export interface ParsedOptions extends Options {
  I: RegExp[];
}

const convertGlobs = (globs: string[]): RegExp[] => {
  if (!globs) return [];
  return globs.map(glob => gtr(glob));
};

export const handleOptions = (rawOptions: RawOptions) => {
  const parsedOptions: ParsedOptions = {
    ...rawOptions,
    i: rawOptions.i ? [...rawOptions.i, ...DEFAULT_IGNORE] : DEFAULT_IGNORE,
    I: convertGlobs(rawOptions.I)
  };
  const errs = [];
  if (!parsedOptions.p) {
    // path cannot be omitted
    errs.push(NO_PATH_ERR);
  } else if (!existsSync(parsedOptions.p)) {
    errs.push(BAD_PATH_ERR);
  }
  if (!parsedOptions.e) {
    // extensions cannot be omitted
    errs.push(NO_EXT_ERR);
  }
  if (errs.length) {
    throw new Error(errs.join("\n"));
  }
  return parsedOptions;
};
