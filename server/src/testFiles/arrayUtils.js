// src/arrayUtils.js
const { add } = require('./mathUtils.js');
const { formatResult } = require('./stringUtils.js');
const _ = require('lodash');
const { processTemplate } = require('./templateUtils.js');

/**
 * Adds an element to an array.
 * @param {Array<T>} arr The array.
 * @param {T} item The item to add.
 * @returns {Array<T>} The new array.
 * @template T
 */
function addToArray(arr, item) {
	const newArr = [...arr, item];
	console.log(formatResult(`Added item: ${item} to array.`));
	return newArr;
}

/**
 * Calculates the sum of numbers in an array using an external math utility.
 * @param {number[]} numbers The array of numbers.
 * @returns {number} The sum.
 */
function sumArray(numbers) {
	let total = 0;
	for (const num of numbers) {
		total = add(total, num); // Uses mathUtils
	}
	return total;
}

/**
 * Filters an array based on a predicate and formats the result.
 * @param {Array<T>} arr The array to filter.
 * @param {(item: T) => boolean} predicate The filtering function.
 * @returns {Array<T>} The filtered array.
 * @template T
 */
function filterAndFormat(arr, predicate) {
	const filtered = _.filter(arr, predicate);
	const formatted = filtered.map((item) => (typeof item === 'string' ? formatResult(item) : item)); // Uses stringUtils
	console.log(
		processTemplate('Filtered array template: {{data}}', { data: JSON.stringify(formatted) })
	);
	return formatted;
}

// Another unrelated utility that could cause issues
/**
 * Gets the first element of an array.
 * @param {Array<T>} arr The array.
 * @returns {T | undefined} The first element or undefined.
 * @template T
 */
function getFirstElement(arr) {
	return arr.length > 0 ? arr[0] : undefined;
}

module.exports = {
	addToArray,
	sumArray,
	filterAndFormat,
	getFirstElement,
};
