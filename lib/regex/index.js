/* isNumberRegex:
 *   Match 1234, 12.34, .34, 34, -34
 *   Do not match inside a string
 *   Do not match inside a variable name
 * 
 * isStringRegex:
 *   Cannot be preceded by `require (`, `from`, `class=`, `className=`
 *   Must have single or double quotes or backticks preceding and following
 *   Opted not to use lookbehind and lookahead for quotation marks, since this means you will get overlap
 *     e.g. "thing one", "thing two" becomes three matches: 1: "thing one" 2: ", " 3: "thing two"
 *     This does mean that leading and trailing quotation marks need to be stripped off
 * 
 * isNumericObjKeyRegex:
 *   Since object keys in the ValueList will turn into strings, need a way to ID as numbers. Used ### number ###
 * 
 * stripNumbericObjKeyRegex:
 *   Used to move the hashes surrounding a numeric object key
 * 
 * stripQuotesRegex:
 *   See explanation in isStringRegex about using lookahead/behind for quotation marks
 *   Used to remove those quotation marks.
 */

const isNumberRegex = /(?<!\w|\$|['"`] *)(?:\d{1,}\.?\d*|\.?\d{1,})(?!\w|\$)/m;
const isStringRegex = /(?<!require *\( *| from *|class(?:Name)?= ?)(['`"]).*?\1/m;
const isNumericObjKeyRegex = /### \d*.?\d* ###/;
const stripNumericObjKeyRegex = /#* */g;
const stripQuotesRegex = /^['"`]|['"`]$/g;


module.exports = {
    isNumberRegex,
    isNumberRegexGlobal: new RegExp(isNumberRegex, "g"),
    isStringRegex,
    isStringRegexGlobal: new RegExp(isStringRegex, "g"),
    isNumericObjKeyRegex,
    stripNumericObjKeyRegex,
    stripQuotesRegex
};
