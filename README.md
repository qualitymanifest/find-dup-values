Recursively navigates a file tree and searches inside files for repeated strings and numbers. Then, prints out a list of all repeated values and the files they are found in. Useful to find values that should be moved to a constants file.

Needs a lot of work:
- Need to investigate compatibility with other languages. Currently only tested with `.js` files, where there are considerations like ignoring `require`s and `imports`, etc. Will likely require slightly different regex for other languages.
- Need to accept arguments for file extensions to use
- Need to accept arguments for file/dirnames to ignore
- Test coverage
- Error handling


### Usage:


```
node main.js [options]
--dir="../Path/To/Project"
```
