This project recursively navigates a file tree and searches inside files for repeated strings and numbers. When done, it prints out a list of all repeated values and the files they are found in. This can be useful to find values that should be moved to a constants file.

Processing all 1.23mloc of JavaScript in Node.js (including lib, tests, benchmarks, all dependencies like v8 and npm as well as their tests) takes approx 4 seconds on a mid-range processor. Most projects will take less than half a second to process.

## Usage:

#### Initial setup:

```
npm install
npm run build
```

#### Run:

```
npm run start -- [options]
-p   Path to file or directory to start at
-i   Comma-separated list of file or directory names to ignore
-I   Same as -i, but takes globs instead of strings
-e   Comma-separated list of file extensions to read from
```

Alternatively, you can provide options by modifying `config.js`. This way you do not have to provide command line arguments, however if you do, they take precedent over `config.js`.
