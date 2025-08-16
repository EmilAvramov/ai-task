// src/templateUtils.js
const { createConfig } = require('./mathUtils.js'); // Direct dependency on mathUtils
const { formatResult } = require('./stringUtils.js'); // Direct dependency on stringUtils
const { addToArray } = require('./arrayUtils.js'); // Circular dependency with arrayUtils.js

/**
 * Processes a template string with provided data.
 * @param {string} template The template string (e.g., "Hello, {{name}}!").
 * @param {Record<string, any>} data The data object to substitute.
 * @returns {string} The processed string.
 */
function processTemplate(template, data) {
	let result = template;
	for (const key in data) {
		if (Object.prototype.hasOwnProperty.call(data, key)) {
			const placeholder = `{{${key}}}`;
			result = result.replace(new RegExp(placeholder, 'g'), String(data[key]));
		}
	}
	console.log(formatResult(`Template processed: ${result}`)); // Uses stringUtils
	return result;
}

/**
 * Generates a templatized welcome message.
 * @param {string} userName User's name.
 * @returns {string} Welcome message.
 */
function generateWelcomeMessage(userName) {
	const config = createConfig('welcome'); // Uses mathUtils
	const template = `Welcome, {{name}}! Your session ID is {{id}}.`;
	return processTemplate(template, { name: userName, id: config.id });
}

/**
 * A utility that uses arrayUtils, causing a circular dependency.
 * @param {string[]} items Items to process.
 * @param {string} template Template for each item.
 * @returns {string[]} Array of processed strings.
 */
function processItemsWithTemplate(items, template) {
	const processed = [];
	for (const item of items) {
		const tempResult = processTemplate(template, { item: item });
		addToArray(processed, tempResult); // Uses arrayUtils, completing the circle
	}
	return processed;
}

// Simple template cache
const templateCache = {};

/**
 * Caches a template by name.
 * @param {string} name Cache name.
 * @param {string} content Template content.
 */
function cacheTemplate(name, content) {
	templateCache[name] = content;
}

module.exports = {
	processTemplate,
	generateWelcomeMessage,
	processItemsWithTemplate,
	cacheTemplate,
};
