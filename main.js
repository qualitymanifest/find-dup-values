const { readFile, readdir, lstat } = require("fs").promises;
const { join } = require("path");
const { queue } = require("async");
const { red } = require("colors/safe");

const {
    isNumberRegexGlobal,
    isStringRegexGlobal,
    stripQuotesRegex
} = require("./lib/regex");
const handleArgs = require("./lib/handle_args");
const ValueList = require("./lib/ValueList");
const valueList = new ValueList();

const ignoreDirs = ["node_modules", ".git", ".meteor"];
const ignoreFiles = ["scatterplot.jsx", "constants.js"];

const q = queue(async ({ path, isDir }) => {
    if (isDir) {
        const dirContents = await readdir(path, { withFileTypes: true });
        dirContents.map(dirent => {
            const { name } = dirent;
            const newPath = join(path, name);
            if (dirent.isDirectory() && !ignoreDirs.includes(dirent.name)) {
                q.push({ path: newPath, isDir: true });
            }
            else if (!ignoreFiles.includes(name) && (name.endsWith(".jsx") || name.endsWith(".js"))) {
                q.push({ path: newPath, isDir: false });
            }
        })
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

const runPipeline = async (args) => {
    const processedArgs = handleArgs(args);
    const stat = await lstat(processedArgs.dir);
    const isDir = stat.isDirectory();
    q.push({ path: processedArgs.dir, isDir });
    await q.drain();
    valueList.removeSingles();
    valueList.print();
}

runPipeline();

module.exports = runPipeline;
