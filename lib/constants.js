const { red, yellow } = require("colors/safe");

const NO_PATH_ERR = red.bold("Please provide a file or directory to start from");
const BAD_PATH_ERR = red.bold("The starting path provided could not be resolved");
const NO_EXT_ERR = red.bold("Please provide a list of file extensions to search for");
const DEFAULT_IGNORE = ["node_modules", ".git"];

module.exports = {
    NO_PATH_ERR,
    BAD_PATH_ERR,
    NO_EXT_ERR,
    DEFAULT_IGNORE
};