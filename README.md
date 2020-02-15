This project recursively navigates a file tree and searches inside files for repeated strings and numbers. When done, it prints out a list of all repeated values and the files they are found in. This can be useful to find values that should be moved to a constants file. Processing and printing the results of Node.js's 50kloc `lib` directory takes approx 0.6 seconds on a i5-8250U processor.

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
