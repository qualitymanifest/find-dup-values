const { readFile, readdir, lstat } = require("fs").promises; // https://github.com/nodejs/node/pull/31553
import { Dirent } from "fs";
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

const q = queue(async ({ path, isDir }) => {
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
  let fileContents = await readFile(path, "utf8");
  fileContents = fileContents.replace(removeCommentsRegex, "");
  let strings = fileContents.match(isStringRegexGlobal);
  let numbers = fileContents.match(isNumberRegexGlobal);
  // .match returns null if it's empty
  if (strings) {
    // Strip out leading and trailing quotation marks
    strings = strings.map((s: string) => s.replace(stripQuotesRegex, ""));
    valueList.addValues(strings, path);
  }
  if (numbers) {
    const actualNumbers = numbers.map((numStr: string): number => {
      const actualNumber = Number(numStr);
      if (isNaN(actualNumber)) throw new Error("Number regex failed");
      return actualNumber;
    });
    valueList.addValues(actualNumbers, path);
  }
};

const main = async () => {
  const stat = await lstat(options.p);
  const isDir = stat.isDirectory();
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
