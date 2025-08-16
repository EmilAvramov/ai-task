// src/mathUtils.js
const { v4: uuidv4 } = require('uuid');
const { formatResult } = require('./stringUtils.js'); // Circular dependency with stringUtils.js

/**
 * Adds two numbers.
 * @param {number} a First number.
 * @param {number} b Second number.
 * @returns {number} Sum.
 */
function add(a, b) {
	console.log(`Adding ${a} and ${b}`);
	return a + b;
}

/**
 * Subtracts two numbers.
 * @param {number} a First number.
 * @param {number} b Second number.
 * @returns {number} Difference.
 */
function subtract(a, b) {
	return a - b;
}

/**
 * Multiplies two numbers.
 * @param {number} a First number.
 * @param {number} b Second number.
 * @returns {number} Product.
 */
function multiply(a, b) {
	return a * b;
}

/**
 * Creates a unique configuration object.
 * @param {string} name Configuration name.
 * @returns {{ id: string, name: string }} Config object with a unique ID.
 */
function createConfig(name) {
	const configId = uuidv4();
	console.log(formatResult(`Created config with ID: ${configId}`)); // Uses stringUtils
	return { id: configId, name };
}

// Just another export to demonstrate more surface area
const PI = 3.14159;

module.exports = {
	add,
	subtract,
	multiply,
	createConfig,
	PI,
};
