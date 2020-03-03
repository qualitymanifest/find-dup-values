import "colors";

export const NO_PATH_ERR = "Please provide a file or directory to start from"
  .red.bold;
export const BAD_PATH_ERR = "The starting path provided could not be resolved"
  .red.bold;
export const NO_EXT_ERR = "Please provide a list of file extensions to search for"
  .red.bold;
export const MIN_TYPE_ERR = "Min must be a number".red.bold;
export const DEFAULT_IGNORE = ["node_modules", ".git"];
