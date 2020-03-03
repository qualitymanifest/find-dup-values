This project recursively navigates a file tree and searches inside files for repeated strings and numbers. This can be useful to find values that should be moved to a constants file. It can be run from the command line, in which case it prints out the list of values as well as the files they were found in. It can also be used as a node.js module so you can handle the results yourself.

Processing all 1.23mloc of JavaScript in Node.js (including lib, tests, benchmarks, all dependencies like v8 and npm as well as their tests) takes approx 4 seconds on a mid-range processor. Most projects will take less than half a second to process.

## CLI Usage:

#### Setup:

- Clone or download, then navigate to the project directory
- `npm install`

#### Run:

<pre>
npm run start -- [options]
<b>-p | --path</b>         Path to file or directory to start at
<b>-e | --extensions</b>   Comma-separated list of file extensions to read from
-i | --ignore       Comma-separated list of file/dir names to ignore, compatible with globs
-m | --min          Minimum number of times a value must be repeated to be included
-c | --config       Path to config file which exports the above values
</pre>

#### Note:

- **Bold** options are required
- If a config file is provided as well as other CLI arguments, the CLI arguments take precedence
- For an example of how a config file should be formatted, see the `config` object in the module example below

## Module Usage:

#### Setup:

- `npm install https://github.com/qualitymanifest/find-dup-values/tarball/master`

#### Run:

```js
const fdv = require("find-dup-values");

const config = {
  path: "../path/to/project", // required
  extensions: [".js", ".jsx", ".ts", ".tsx"], // required
  ignore: [".someDir", "someFile.js", "*test*", "*spec.js"],
  min: 3
};

fdv(config)
  .then(valueJSON => {
    // valueJSON contains a `values` key, which is an array containing the following value objects
    // sorted in ascending order by the total number of occurrences
    valueJSON.values.forEach(value => {
      console.log(value.data); // the string/number value
      console.log(value.total); // the total number of times it was found across the project
      for (let [path, amount] of Object.entries(value.paths)) {
        console.log(`${path}: ${amount}`); // file path and # of occurrences at that path
      }
    });
  })
  .catch(err => /* handle err */);
```
