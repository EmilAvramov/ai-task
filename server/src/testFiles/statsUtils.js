// src/statsUtils.js
const { add } = require('./mathUtils.js');
const { formatResult } = require('./stringUtils.js');
const { processTemplate } = require('./templateUtils.js'); // Direct dependency on templateUtils
const { calculateAverage } = require('./arrayUtils.js'); // Direct dependency on arrayUtils

/**
 * Calculates the average of a list of numbers.
 * @param {number[]} numbers Array of numbers.
 * @returns {number} Average.
 */
function getAverage(numbers) {
	if (numbers.length === 0) return 0;
	const sum = numbers.reduce((acc, num) => add(acc, num), 0); // Uses mathUtils
	const avg = sum / numbers.length;
	console.log(formatResult(`Calculated average: ${avg}`)); // Uses stringUtils
	return avg;
}

/**
 * Finds the maximum value in a number array.
 * @param {number[]} numbers Array of numbers.
 * @returns {number} Maximum value.
 */
function getMax(numbers) {
	return Math.max(...numbers);
}

/**
 * Generates a statistics report using a template.
 * @param {any} data Data for the report.
 * @returns {string} Formatted report string.
 */
function generateReport(data) {
	const template = 'Report generated on {{date}}. Data: {{data}}';
	const report = processTemplate(template, {
		date: new Date().toLocaleDateString(),
		data: JSON.stringify(data),
	}); // Uses templateUtils
	console.log(`Report: ${report}`);
	return report;
}

/**
 * Calculates a derived metric that relies on both array and math utilities.
 * @param {number[]} data Numeric data.
 * @returns {number} A processed metric.
 */
function calculateDerivedMetric(data) {
	const avg = calculateAverage(data); // Assume calculateAverage exists in arrayUtils, illustrating another dependency
	const result = add(avg, 10);
	return result;
}

// Placeholder for a function that might introduce a circularity with another module
/**
 * Logs statistics.
 * @param {any} stats Stats object to log.
 */
function logStats(stats) {
	console.log(formatResult(`Logging stats: ${JSON.stringify(stats)}`)); // Uses stringUtils
}

module.exports = {
	getAverage,
	getMax,
	generateReport,
	calculateDerivedMetric,
	logStats,
};
