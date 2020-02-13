const safe = require("safe-regex");
const {
  isNumberRegex,
  isStringRegex,
  isStringRegexGlobal
} = require("./index");

describe("numberRegex", () => {
  it("Tests true for numbers with decimals", () => {
    expect(isNumberRegex.test("12.34")).toBeTruthy();
  });
  it("Tests true for decimals without a number before the point", () => {
    expect(isNumberRegex.test(".34")).toBeTruthy();
  });
  it("Tests true for negative numbers", () => {
    expect(isNumberRegex.test("-3")).toBeTruthy();
  });
  it("Tests false for numbers in strings", () => {
    expect(isNumberRegex.test("' 123 '")).toBeFalsy();
  });
  it("Tests false for numbers with adjacent letters before", () => {
    expect(isNumberRegex.test("var ab12 = 'whatever'")).toBeFalsy();
  });
  it("Tests false for numbers with adjacent letters after", () => {
    expect(isNumberRegex.test("1px")).toBeFalsy();
  });
  it("Tests false for numbers with adjacent letters on both sides", () => {
    expect(isNumberRegex.test("var ab12cd = 'whatever'")).toBeFalsy();
  });
  it("Does not run in exponential time", () => {
    expect(safe(isNumberRegex)).toBeTruthy();
  });
});

describe("stringRegex", () => {
  it("Tests true for strings with various types of quotation marks", () => {
    expect(isStringRegex.test("'test'")).toBeTruthy();
    expect(isStringRegex.test("`test`")).toBeTruthy();
    expect(isStringRegex.test('"test"')).toBeTruthy();
  });
  it("Tests true for strings with numbers in them", () => {
    expect(isStringRegex.test("'123'")).toBeTruthy();
  });
  it("Tests true in an if statement with adjacent characters", () => {
    expect(isStringRegex.test('if (thing==="test")')).toBeTruthy();
  });
  it("Tests false for numbers", () => {
    // Remember that everything in the file it reads is a string.
    // So, a number is just a string without other quotation marks
    expect(isStringRegex.test("123")).toBeFalsy();
  });
  it("Tests false for html type attributes", () => {
    expect(isStringRegex.test("<button type='submit'>")).toBeFalsy();
  });
  it("Tests false for require", () => {
    expect(isStringRegex.test("const thing = require('thing')")).toBeFalsy();
  });
  it("Tests false for import", () => {
    expect(isStringRegex.test("import { thing } from 'thing'")).toBeFalsy();
  });
  it("Tests false for class names", () => {
    expect(isStringRegex.test("className='thing1 thing2'")).toBeFalsy();
    expect(isStringRegex.test("class='thing1 thing2'")).toBeFalsy();
  });
  it("Returns one match when there are quotation marks inside of strings", () => {
    const matches = `"test 'inner quote' test"`.match(isStringRegexGlobal);
    expect(matches.length).toEqual(1);
    expect(matches[0]).toBe(`"test 'inner quote' test"`);
  });
  it("Returns two matches for concatenated strings", () => {
    const matches = "'first' + 'second'".match(isStringRegexGlobal);
    expect(matches.length).toEqual(2);
    expect(matches[0]).toBe("'first'");
    expect(matches[1]).toBe("'second'");
  });
  it("Does not run in exponential time", () => {
    expect(safe(isStringRegex)).toBeTruthy();
  });
});
