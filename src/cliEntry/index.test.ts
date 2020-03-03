// Note that error handling for missing required arguments is handled in handleOptions, not cliEntry

const cliEntry = require("./index");

process.argv.push(
  "-p",
  "../fake-path",
  "-i",
  "thing1,thing2,*test*,benchmark*",
  "-e",
  ".js,.ts"
);

const args = cliEntry();

describe("cliEntry", () => {
  it("Maps short-form arguments to long-form arguments", () => {
    expect(args).toHaveProperty("path");
    expect(args).toHaveProperty("ignore");
    expect(args).toHaveProperty("extensions");
  });
  it("Converts ignoreStrings, ignoreGlobs, and extensions to arrays", () => {
    // Globs aren't converted to regex until passed through handleOptions
    const expectedIgnore = ["thing1", "thing2", "*test*", "benchmark*"];
    const expectedExtensions = [".js", ".ts"];
    expect(args.ignore).toEqual(expect.arrayContaining(expectedIgnore));
    expect(args.extensions).toEqual(expect.arrayContaining(expectedExtensions));
  });
  it("Throws an error if a nonexistent config file is specified", () => {
    process.argv.push("-c", "aisdjfoiasdjf");
    expect(() => cliEntry()).toThrow();
  });
});
