const gar = require("gar");

const {
  parseIgnoreArgs,
  parseExtensionArgs,
  handleOptions
} = require("./index");
const { NO_PATH_ERR, BAD_PATH_ERR, NO_EXT_ERR } = require("../constants");

/* If arguments are missing or erroneous, an error array is built with each problem
 * After all arguments have been processed, the errors are console.logged and the process exits
 * In use, handleOptions will receive an argument containing the object from the config file if it exists
 * If not it looks for process.argv CLI args. Since these can't be mocked with jest, mock them with gar.
 */

const nativeOverrides = () => {
  console.log = jest.fn();
  process.exit = jest.fn();
};

describe("parseExtensionArgs", () => {
  it("Handles a comma-separated string", () => {
    const result = parseExtensionArgs(".js,.jsx,.ts");
    expect(result).toEqual(expect.arrayContaining([".js", ".jsx", ".ts"]));
  });
  it("Handles errant spaces", () => {
    const result = parseExtensionArgs(" .js ,.jsx, .ts");
    expect(result).toEqual(expect.arrayContaining([".js", ".jsx", ".ts"]));
  });
  it("Handles a config array", () => {
    const result = parseExtensionArgs([".js", ".jsx", ".ts"]);
    expect(result).toEqual(expect.arrayContaining([".js", ".jsx", ".ts"]));
  });
});

describe("parseIgnoreArgs", () => {
  it("Handles a comma-separated string", () => {
    const result = parseIgnoreArgs(".meteor,other.js");
    expect(result).toEqual(expect.arrayContaining([".meteor", "other.js"]));
  });
  it("Handles errant spaces", () => {
    const result = parseIgnoreArgs(" .meteor   ,other.js");
    expect(result).toEqual(expect.arrayContaining([".meteor", "other.js"]));
  });
  it("Handles a config array", () => {
    const result = parseIgnoreArgs([".meteor", /test/g, "other.js"]);
    expect(result).toEqual(
      expect.arrayContaining([".meteor", /test/g, "other.js"])
    );
  });
});

describe("handleOptions", () => {
  it("Handles all valid input", () => {
    const args = {
      p: "./",
      i: [".meteor", /test/g, "other.js"],
      e: [".js", ".jsx", ".ts"]
    };
    const result = handleOptions(args);
    expect(result.p).toBe("./");
    expect(result.i).toEqual(
      expect.arrayContaining([".meteor", /test/g, "other.js"])
    );
    expect(result.e).toEqual(expect.arrayContaining([".js", ".jsx", ".ts"]));
  });
  it("Logs error and exits process if no starting file/dir is given", () => {
    nativeOverrides();
    const args = gar(["-e", ".js,.jsx,.ts"]);
    handleOptions(args);
    expect(console.log).toHaveBeenCalledWith(NO_PATH_ERR);
    expect(process.exit).toHaveBeenCalled();
  });
  it("Logs error and exits process if a non-existent file/dir is given", () => {
    nativeOverrides();
    const args = gar(["-p", "./not/real/at/all", "-e", ".js,.jsx,.ts"]);
    handleOptions(args);
    expect(console.log).toHaveBeenCalledWith(BAD_PATH_ERR);
    expect(process.exit).toHaveBeenCalled();
  });
  it("Logs error and exits process if a no file extensions are given", () => {
    nativeOverrides();
    const args = gar(["-p", "./"]);
    handleOptions(args);
    expect(console.log).toHaveBeenCalledWith(NO_EXT_ERR);
    expect(process.exit).toHaveBeenCalled();
  });
});
