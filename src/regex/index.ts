/* isNumberRegex:
 *   Match N, N.N, .N, -N
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
 *
 * non-global versons are needed for testing purposes so that match state doesn't carry over
 *   See https://stackoverflow.com/questions/2630418/javascript-regex-returning-true-then-false-then-true-etc
 */

export const removeCommentsRegex = /(\/\/.*)|(\/\*(\w|\s|\n|\/|(\*(?!\/)))*\*\/)/gm;
export const isNumberRegex = /(?<!\w|\$|['"`] *)(?:\d+\.?\d*|\.?\d+)(?!\w|\$)/m;
export const isStringRegex = /(?<!(?:class(?:Name)?|type|require|from) *[=\(]? *)(['`"]).*?\1/m;
export const stripQuotesRegex = /^['"`]|['"`]$/g;

export const isNumberRegexGlobal = new RegExp(isNumberRegex, "g");
export const isStringRegexGlobal = new RegExp(isStringRegex, "g");
