const { readFile, readdir, lstat } = require("fs").promises;
const { join } = require("path");
const { queue } = require("async");
const { red, green, cyan, yellow } = require("colors/safe");

const {
    isNumberRegexGlobal,
    isStringRegexGlobal,
    isNumericObjKeyRegex,
    stripNumericObjKeyRegex,
    stripQuotesRegex
} = require("./lib/regex");
const handleArgs = require("./lib/handle_args");

const ignoreDirs = ["node_modules", ".git", ".meteor"];
const ignoreFiles = ["scatterplot.jsx", "constants.js"];
const valueList = {};

const q = queue(async ({ path, isDir }, cb) => {
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
        addValues(values, path);
    }
}, 1);

q.error((err, task) => {
    console.log(red(`Task ${task.path} experienced an error: ${err}`));
});

const processFile = async (path) => {
    const fileContents = await readFile(path, "utf8");
    let strings = fileContents.match(isStringRegexGlobal);
    let numbers = fileContents.match(isNumberRegexGlobal);
    // Strip out leading and trailing quotation marks
    strings = strings ? strings.map((string) => string.replace(stripQuotesRegex, "")) : [];
    // .match returns numbers, not strings
    // could convert it to a number, but it's still going to end up as a string when it becomes an object key
    // use ###  ### to indicate that it's really a number
    numbers = numbers ? numbers.map((number) => `### ${number} ###`) : [];
    return [...strings, ...numbers];
}

const addValues = (values, path) => {
    values.forEach(value => {
        if (!valueList[value]) {
            valueList[value] = { [path]: 1 };
        }
        else if (!valueList[value][path]) {
            valueList[value][path] = 1;
        }
        else valueList[value][path] += 1;
    });
}

const removeSingles = () => {
    const dupes = [];
    Object.entries(valueList).forEach(([value, pathList]) => {
        const pathKeys = Object.keys(pathList);
        if (pathKeys.length > 1 || pathList[pathKeys[0]] > 1) {
            dupes.push({ value, pathList });
        }
    });
    return dupes;
};

const printResults = (results) => {
    results = results.sort((a, b) => {
        return (a.value > b.value);
    })
    results.forEach(res => {
        if (isNumericObjKeyRegex.test(res.value)) {
            res.value = res.value.replace(stripNumericObjKeyRegex, "");
            console.log(green.bold(res.value))
        }
        else {
            console.log(cyan.bold(res.value));
        }
        let total = 0;
        for (let [path, amount] of Object.entries(res.pathList)) {
            console.log(`     ${path} ` + yellow.bold(amount));
            total += amount;
        }
        console.log(red.bold(`                      TOTAL: ${total}`));
    });
}

const runPipeline = async (args) => {
    const processedArgs = handleArgs(args);
    const stat = await lstat(processedArgs.dir);
    const isDir = stat.isDirectory();
    q.push({ path: processedArgs.dir, isDir });
    await q.drain();
    const dupes = removeSingles();
    printResults(dupes);
}

runPipeline();

module.exports = runPipeline;