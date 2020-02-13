const { existsSync } = require("fs");
const gar = require("gar");

const {
  NO_PATH_ERR,
  BAD_PATH_ERR,
  NO_EXT_ERR,
  DEFAULT_IGNORE
} = require("../constants");

// CLI args will be a string, config file args should be an array
const splitIfString = arg => (typeof arg === "string" ? arg.split(",") : arg);

const replaceSpaces = str => str.replace(/\s/g, "");

const parseIgnoreArgs = ignoreArr => {
  if (!ignoreArr) return DEFAULT_IGNORE;
  const userIgnore = splitIfString(ignoreArr).map(ignoreEl => {
    // If these arguments came from a config file, its possible ignoreEl is a RegExp
    // Make sure it is a string before trying to remove spaces
    return typeof ignoreEl === "string" ? replaceSpaces(ignoreEl) : ignoreEl;
  });
  return [...DEFAULT_IGNORE, ...userIgnore];
};

const parseExtensionArgs = (extensionArr, errs) => {
  if (!extensionArr) {
    errs.push(NO_EXT_ERR);
    return;
  }
  return splitIfString(extensionArr).map(extension => replaceSpaces(extension));
};

const handleOptions = config => {
  const errs = [];
  const args = gar(process.argv.slice(2));
  // CLI args take precedent over config file
  const options = {
    p: args.p ? args.p : config.p,
    i: args.i ? args.i : config.i,
    e: args.e ? args.e : config.e
  };
  options.i = parseIgnoreArgs(options.i);
  options.e = parseExtensionArgs(options.e, errs);
  if (options.p && !existsSync(options.p)) {
    errs.push(BAD_PATH_ERR);
  } else if (!options.p) {
    errs.push(NO_PATH_ERR);
  }
  if (errs.length) {
    errs.forEach(err => console.log(err));
    process.exit();
  }
  return options;
};

module.exports = {
  parseIgnoreArgs,
  parseExtensionArgs,
  handleOptions
};
