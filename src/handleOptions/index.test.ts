import minimist from "minimist";

import { handleOptions } from "./index";
import { NO_PATH_ERR, BAD_PATH_ERR, NO_EXT_ERR } from "../constants";

/* If arguments are missing or erroneous, an error array is built with each problem
 * After all arguments have been processed, the errors are console.logged and the process exits
 * In use, handleOptions will receive an argument containing the object from the config file if it exists
 * If not it looks for process.argv CLI args. Since these can't be mocked with jest, mock them with gar.
 */

const catchErrMsg = args => {
  let errMsg;
  try {
    handleOptions(args);
  } catch (e) {
    errMsg = e.message;
  }
  return errMsg;
};

describe("handleOptions", () => {
  it("Handles all valid input", () => {
    const args = {
      p: "./",
      i: [".meteor", "test", "other.js"],
      I: ["*test*"],
      e: [".js", ".jsx", ".ts"]
    };
    const result = handleOptions(args);
    expect(result.p).toBe("./");
    expect(result.i).toEqual(
      expect.arrayContaining([".meteor", "test", "other.js"])
    );
    expect(result.I).toEqual(expect.arrayContaining([/^.*test.*$/]));
    expect(result.e).toEqual(expect.arrayContaining([".js", ".jsx", ".ts"]));
  });
  it("Throws an error if no starting file/dir is given", () => {
    const args = minimist(["-e", ".js,.jsx,.ts"]);
    const errMsg = catchErrMsg(args);
    expect(errMsg).toEqual(NO_PATH_ERR);
  });
  it("Throws an error if a non-existent file/dir is given", () => {
    const args = minimist(["-p", "./not/real/at/all", "-e", ".js,.jsx,.ts"]);
    const errMsg = catchErrMsg(args);
    expect(errMsg).toEqual(BAD_PATH_ERR);
  });
  it("Throws an error if a no file extensions are given", () => {
    const args = minimist(["-p", "./"]);
    const errMsg = catchErrMsg(args);
    expect(errMsg).toEqual(NO_EXT_ERR);
  });
});
