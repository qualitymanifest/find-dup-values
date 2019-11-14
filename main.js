const { readFile, readdir, lstat } = require("fs").promises;
const { join, extname } = require("path");
const { queue } = require("async");
const { red } = require("colors/safe");

const IS_JEST = !!process.env.JEST_WORKER_ID;
const {
    isNumberRegexGlobal,
    isStringRegexGlobal,
    stripQuotesRegex
} = require("./lib/regex");
const { handleOptions } = require("./lib/handle-options");
const config = require("./config");
const options = handleOptions(config);
const ValueList = require("./lib/ValueList");
const valueList = new ValueList();

const q = queue(async ({ path, isDir }) => {
    if (isDir) {
        const dirContents = await readdir(path, { withFileTypes: true });
        dirContents.map(dirent => {
            const newPath = join(path, dirent.name);
            const newIsDir = dirent.isDirectory();
            if (shouldRead(dirent.name, newIsDir)) {
                q.push({ path: newPath, isDir: newIsDir });
            }
        });
    }
    else {
        const values = await processFile(path);
        valueList.addValues(values, path);
    }
}, 1);

q.error((err, task) => {
    console.log(red(`Task ${task.path} experienced an error: ${err}`));
    throw err;
});

const shouldRead = (name, isDir) => {
    if (!isDir && !options.e.includes(extname(name))) {
        return false;
    }
    for (let ignoreEl of options.i) {
        if (ignoreEl instanceof RegExp) {
            const test = ignoreEl.test(name);
            if (test) {
                return false;
            }
        }
        else if (ignoreEl === name) {
            return false;
        }
    }
    return true;
}

const processFile = async (path) => {
    const fileContents = await readFile(path, "utf8");
    let strings = fileContents.match(isStringRegexGlobal);
    let numbers = fileContents.match(isNumberRegexGlobal);
    // Strip out leading and trailing quotation marks
    // .match returns null if it's empty
    strings = strings ? strings.map((string) => string.replace(stripQuotesRegex, "")) : [];
    numbers = numbers ? numbers : [];
    return { strings, numbers };
}

const main = async () => {
    const stat = await lstat(options.p);
    const isDir = stat.isDirectory();
    q.push({ path: options.p, isDir });
    await q.drain();
    valueList.removeSingles();
    if (IS_JEST) {
        return valueList;
    }
    else {
        valueList.print();
    }
}

if (!IS_JEST) {
    main();
}

module.exports = main;
