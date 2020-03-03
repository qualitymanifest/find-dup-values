import { existsSync } from "fs";
import isGlob from "is-glob";
import gtr from "glob-to-regexp";

import {
  BAD_PATH_ERR,
  NO_PATH_ERR,
  NO_EXT_ERR,
  MIN_TYPE_ERR,
  DEFAULT_IGNORE
} from "../constants";

interface Options {
  path: string;
  extensions: string[];
  min: number;
}

export interface RawOptions extends Options {
  ignore: string[];
}

export interface ParsedOptions extends Options {
  ignoreStrings: string[];
  ignoreRegexes: RegExp[];
}

const processIgnore = (ignoreItems: string[] = []) => {
  const ignoreStrings = DEFAULT_IGNORE;
  const ignoreRegexes: RegExp[] = [];
  ignoreItems.forEach(item => {
    if (isGlob(item)) {
      ignoreRegexes.push(gtr(item));
    } else {
      ignoreStrings.push(item);
    }
  });
  return { ignoreStrings, ignoreRegexes };
};

export const handleOptions = (rawOptions: RawOptions) => {
  const { path, ignore, extensions, min } = rawOptions;
  const { ignoreStrings, ignoreRegexes } = processIgnore(ignore);
  const processedOptions: ParsedOptions = {
    path,
    ignoreStrings,
    ignoreRegexes,
    extensions,
    min: min || 2
  };
  const errs = [];
  if (!processedOptions.path) {
    // path cannot be omitted
    errs.push(NO_PATH_ERR);
  } else if (!existsSync(processedOptions.path)) {
    errs.push(BAD_PATH_ERR);
  }
  if (!processedOptions.extensions) {
    // extensions cannot be omitted
    errs.push(NO_EXT_ERR);
  }
  if (processedOptions.min && typeof processedOptions.min !== "number") {
    errs.push(MIN_TYPE_ERR);
  }
  if (errs.length) {
    throw new Error(errs.join("\n"));
  }
  return processedOptions;
};
