// src/stringUtils.js
const { add } = require('./mathUtils.js'); // Circular dependency with mathUtils.js
const { processTemplate } = require('./templateUtils.js'); // Direct dependency on templateUtils

/**
 * Formats a string with a prefix.
 * @param {string} message The message to format.
 * @returns {string} Formatted string.
 */
function formatResult(message) {
	return `[RESULT] ${message}`;
}

/**
 * Capitalizes the first letter of a string.
 * @param {string} str The input string.
 * @returns {string} Capitalized string.
 */
function capitalize(str) {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Creates a combined string from two inputs using a math operation for length.
 * @param {string} s1 First string.
 * @param {string} s2 Second string.
 * @returns {string} Combined string.
 */
function combineStringsWithMath(s1, s2) {
	const totalLength = add(s1.length, s2.length); // Uses mathUtils
	const template = `Combined string (length: {{len}}): {{s1}} - {{s2}}`;
	return processTemplate(template, { len: totalLength, s1: s1, s2: s2 }); // Uses templateUtils
}

/**
 * Checks if a string contains a specific substring.
 * @param {string} text The text to check.
 * @param {string} substring The substring to find.
 * @returns {boolean} True if found, false otherwise.
 */
function containsSubstring(text, substring) {
	return text.includes(substring);
}

// Export a default function (less common but demonstrates syntax)
/**
 * Logs a message with a default prefix.
 * @param {string} message The message to log.
 */
function logMessage(message) {
	console.log(`Default log: ${formatResult(message)}`);
}

module.exports = {
	formatResult,
	capitalize,
	combineStringsWithMath,
	containsSubstring,
	default: logMessage,
};
