import { existsSync } from "fs";
import gtr from "glob-to-regexp";

import {
  BAD_PATH_ERR,
  NO_PATH_ERR,
  NO_EXT_ERR,
  DEFAULT_IGNORE
} from "../constants";

interface Options {
  path: string;
  ignoreStrings: string[];
  extensions: string[];
}

export interface RawOptions extends Options {
  ignoreGlobs: string[];
}

export interface ParsedOptions extends Options {
  ignoreGlobs: RegExp[];
}

const convertGlobs = (globs: string[]): RegExp[] => {
  if (!globs) return [];
  return globs.map(glob => gtr(glob));
};

export const handleOptions = (rawOptions: RawOptions) => {
  const parsedOptions: ParsedOptions = {
    ...rawOptions,
    ignoreStrings: rawOptions.ignoreStrings
      ? [...rawOptions.ignoreStrings, ...DEFAULT_IGNORE]
      : DEFAULT_IGNORE,
    ignoreGlobs: convertGlobs(rawOptions.ignoreGlobs)
  };
  const errs = [];
  if (!parsedOptions.path) {
    // path cannot be omitted
    errs.push(NO_PATH_ERR);
  } else if (!existsSync(parsedOptions.path)) {
    errs.push(BAD_PATH_ERR);
  }
  if (!parsedOptions.extensions) {
    // extensions cannot be omitted
    errs.push(NO_EXT_ERR);
  }
  if (errs.length) {
    throw new Error(errs.join("\n"));
  }
  return parsedOptions;
};
