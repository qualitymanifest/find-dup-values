Recursively navigates a file tree and searches inside files for repeated strings and numbers. Then, prints out a list of all repeated values and the files they are found in. Useful to find values that should be moved to a constants file.

Needs a lot of work:
- Currently, some things like attribute values (e.g. the "submit" in `<input type="submit">`) are not filtered out.
- Need to accept arguments for file extensions to use
- Need to accept arguments for file/dirnames to ignore
- Test coverage
- Error handling



### Usage:


```
node main.js [options]
--dir="../Path/To/Project"
```
