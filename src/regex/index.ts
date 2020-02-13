/* isNumberRegex:
 *   Match 1234, 12.34, .34, 34, -34
 *   Do not match inside a string
 *   Do not match inside a variable name
 *
 * isStringRegex:
 *   Check for preceding `class`, `className`, `type`, `require`, `from` followed by `=`, `(` and potential spaces
 *   Must have single or double quotes or backticks preceding and following
 *   Opted not to use lookbehind and lookahead for quotation marks, since this means you will get overlap
 *     e.g. "thing one", "thing two" becomes three matches: 1: "thing one" 2: ", " 3: "thing two"
 *     This does mean that leading and trailing quotation marks need to be stripped off
 *
 * stripQuotesRegex:
 *   See explanation in isStringRegex about using lookahead/behind for quotation marks
 *   Used to remove those quotation marks.
 */

const isNumberRegex = /(?<!\w|\$|['"`] *)(?:\d+\.?\d*|\.?\d+)(?!\w|\$)/m;
const isStringRegex = /(?<!(?:class(?:Name)?|type|require|from) *[=\(]? *)(['`"]).*?\1/m;
const stripQuotesRegex = /^['"`]|['"`]$/g;

module.exports = {
  isNumberRegex,
  isNumberRegexGlobal: new RegExp(isNumberRegex, "g"),
  isStringRegex,
  isStringRegexGlobal: new RegExp(isStringRegex, "g"),
  stripQuotesRegex
};
