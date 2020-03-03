const { readFile, readdir, lstat } = require("fs").promises; // https://github.com/nodejs/node/pull/31553
import { Dirent, Stats } from "fs";
import { join, extname } from "path";
import { queue } from "async";
import "colors";

import {
  isNumberRegexGlobal,
  isStringRegexGlobal,
  stripQuotesRegex,
  removeCommentsRegex
} from "./regex";
import { handleOptions, RawOptions, ParsedOptions } from "./handleOptions";
import { ValueMap } from "./ValueMap";

const valueMap = new ValueMap();
let filesProcessed = 0;
let options: ParsedOptions;

type QueueArgs = {
  path: string;
  isDir: boolean;
};

const q = queue(async ({ path, isDir }: QueueArgs) => {
  if (isDir) {
    const dirContents = await readdir(path, { withFileTypes: true });
    dirContents.map((dirent: Dirent) => {
      const newPath = join(path, dirent.name);
      const newIsDir = dirent.isDirectory();
      if (shouldRead(dirent.name, newIsDir)) {
        q.push({ path: newPath, isDir: newIsDir });
      }
    });
  } else {
    await processFile(path);
    filesProcessed++;
    if (filesProcessed % 100 === 0) {
      process.stdout.write(`Files processed: ${filesProcessed} \r`);
    }
  }
}, 1);

q.error((err, task) => {
  err.message = `Processing ${task.path} failed`.red;
  throw err;
});

const shouldRead = (name: string, isDir: boolean) => {
  if (!isDir && !options.extensions.includes(extname(name))) {
    return false;
  }
  if (options.ignoreStrings.includes(name)) {
    return false;
  }
  for (let ignoreRegex of options.ignoreRegexes) {
    if (ignoreRegex.test(name)) {
      return false;
    }
  }
  return true;
};

const processFile = async (path: string) => {
  let fileContents: string = await readFile(path, "utf8");
  fileContents = fileContents.replace(removeCommentsRegex, "");
  let strings = fileContents.match(isStringRegexGlobal);
  let numbers = fileContents.match(isNumberRegexGlobal);
  // .match returns null if it's empty
  if (strings) {
    // Strip out leading and trailing quotation marks
    strings = strings.map(s => s.replace(stripQuotesRegex, ""));
    valueMap.addValues(strings, path);
  }
  if (numbers) {
    const actualNumbers: number[] = numbers.map((numStr): number => {
      const actualNumber = Number(numStr);
      if (isNaN(actualNumber)) throw new Error("Numeric regex failed");
      return actualNumber;
    });
    valueMap.addValues(actualNumbers, path);
  }
};

const main = (config: RawOptions): Promise<ValueMap> => {
  return new Promise(async (resolve, reject) => {
    process.on("uncaughtException", err => {
      // This catches errors thrown by q.error
      // This way the caller (CLI or other application) can handle it
      reject(err);
    });
    try {
      options = handleOptions(config);
      const stat: Stats = await lstat(options.path);
      const isDir: boolean = stat.isDirectory();
      q.push({ path: options.path, isDir });
      await q.drain();
    } catch (err) {
      reject(err);
    }
    resolve(valueMap);
  });
};

module.exports = main;
