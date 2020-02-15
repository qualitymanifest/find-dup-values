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
import { handleOptions } from "./handleOptions";
import { ValueList } from "./ValueList";
import config from "../config";
const options = handleOptions(config);
const valueList = new ValueList();
const IS_JEST = !!process.env.JEST_WORKER_ID;
let filesProcessed = 0;

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
  console.log(`Task ${task.path} experienced an error: ${err}`.red);
  throw err;
});

const shouldRead = (name: string, isDir: boolean) => {
  if (!isDir && !options.e.includes(extname(name))) {
    return false;
  }
  if (options.i.includes(name)) {
    return false;
  }
  for (let ignoreRegex of options.I) {
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
    valueList.addValues(strings, path);
  }
  if (numbers) {
    const actualNumbers: number[] = numbers.map((numStr): number => {
      const actualNumber = Number(numStr);
      if (isNaN(actualNumber)) throw new Error("Number regex failed");
      return actualNumber;
    });
    valueList.addValues(actualNumbers, path);
  }
};

const main = async () => {
  const stat: Stats = await lstat(options.p);
  const isDir: boolean = stat.isDirectory();
  q.push({ path: options.p, isDir });
  await q.drain();
  if (IS_JEST) {
    return valueList;
  } else {
    valueList.print();
  }
};

if (!IS_JEST) {
  main();
}

module.exports = main;
