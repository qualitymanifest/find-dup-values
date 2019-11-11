const safe = require("safe-regex");
const {
    isNumberRegex,
    isNumberRegexGlobal,
    isStringRegex,
    isStringRegexGlobal,
    isObjKeyNumberRegex
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
    })
    it("Tests false for numbers in strings", () => {
        expect(isNumberRegex.test("' 123 '")).toBeFalsy();
    });
    it("Tests false for numbers in variable names", () => {
        expect(isNumberRegex.test("var ab12cd = true"));
    });
    it("Does not run in exponential time", () => {
        expect(safe(isNumberRegex)).toBeTruthy();
    });
});

describe("stringRegex", () => {
    it("Tests false for numbers", () => {
        expect(isStringRegex.test(123)).toBeFalsy();
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