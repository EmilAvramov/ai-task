import type {
	Analysis,
	CircularDependencyRaw,
	FileAnalysis,
	FileImports,
	NormalizedImport,
	RawAnalysis,
} from '@types-parser-helpers';
import {
	circularDependencyRecommendation,
	couplingRecommendationGood,
	couplingRecommendationModerate,
	couplingRecommendationPoor,
	dependencyComplexityRecommendationGood,
	dependencyComplexityRecommendationModerate,
	dependencyComplexityRecommendationPoor,
	normalizeString,
} from './string';

/**
 * Receives the file imports to be analysed and compiles the raw analysis for each file
 * by calling the respective helper
 * Before returning the result, calls the function responsible for parsing the raw
 * analysis in order to return it in a standardized format
 */
export const analyseFileImports = (fileImports: FileImports[]): FileAnalysis[] => {
	const rawAnalysis: RawAnalysis[] = [];

	fileImports.forEach((fileImport) => {
		const dependencyCount = fileImport.importMap.length;
		const couplingMap = getCouplingMap(fileImport.importMap);
		const circularDependencies = getCircularDependencies(fileImport, fileImports);

		rawAnalysis.push({
			fileName: fileImport.fileName,
			dependencyCount,
			couplingMap,
			circularDependencies,
		});
	});

	return processRawAnalysis(rawAnalysis);
};

/**
 * Receives the raw analysis objects, retrieves their templates and
 * calls the respective processing functions to handle finalizing the analysis
 */
const processRawAnalysis = (analysis: RawAnalysis[]): FileAnalysis[] => {
	const fileAnalysis: FileAnalysis[] = [];

	analysis.forEach((rawAnalysis) => {
		const { circularDepsAnalysis, couplingAnalysis, dependencyAnalysis } = getAnalysisTemplates();

		processRawDependencyComplexityAnalysis(rawAnalysis.dependencyCount, dependencyAnalysis);
		processRawCircularDependencyAnalysis(rawAnalysis.circularDependencies, circularDepsAnalysis);
		processRawCouplingAnalysis(rawAnalysis.couplingMap, couplingAnalysis);

		fileAnalysis.push({
			fileName: rawAnalysis.fileName,
			analysis: [dependencyAnalysis, circularDepsAnalysis, couplingAnalysis],
		});
	});

	return fileAnalysis;
};

/**
 * Provides a template for the 3 types of analysis
 * These are the default values that will be modified later
 */
const getAnalysisTemplates = (): {
	dependencyAnalysis: Analysis;
	couplingAnalysis: Analysis;
	circularDepsAnalysis: Analysis;
} => {
	const dependencyAnalysis: Analysis = {
		name: 'dependencies',
		score: 10,
		recommendation: 'No recommendations',
	};
	const couplingAnalysis: Analysis = {
		name: 'coupling',
		score: 10,
		recommendation: 'No recommendatios',
	};
	const circularDepsAnalysis: Analysis = {
		name: 'circular',
		score: 10,
		recommendation: 'No Recommendations',
	};

	return { dependencyAnalysis, couplingAnalysis, circularDepsAnalysis };
};

/** @MODIFYING
 * Handles taking the raw analysis data for circular dependencies,
 * calculating the file's score and calling the recommendation helper
 *
 * Each circular dependency penalizes the template's base score of 10 by 3.
 * Circular dependency relations will be provided by the string helper.
 * If the score goes below 0, it is offset to 0.
 */
const processRawCircularDependencyAnalysis = (
	rawAnalysis: RawAnalysis['circularDependencies'],
	template: Analysis
): void => {
	const circulatDepCount = rawAnalysis.count;
	const circularScoreSubtraction = circulatDepCount * 3;

	if (circularScoreSubtraction > 0) {
		template.score -= circularScoreSubtraction;
		template.recommendation = circularDependencyRecommendation(
			rawAnalysis.between.map((s) => s.join(' <-> '))
		);
	}

	if (template.score < 0) {
		template.score = 0;
	}
};
/** @MODIFYING
 * Handles taking the raw analysis data for dependency complexity,
 * calculating the file's score and calling the recommendation helper
 *
 * Each dependency in the file penalizes the template's base score of 10 by 1.
 * A different recommendation is given based on the score.
 * If the score goes below 0, it is offset to 0.
 */
const processRawDependencyComplexityAnalysis = (
	rawAnalysis: RawAnalysis['dependencyCount'],
	template: Analysis
): void => {
	const dependencyComplexitySubtraction = rawAnalysis * 1; // for clarity of scoring

	const recommendationHandlers = [
		{ max: 3, handler: (count: number) => dependencyComplexityRecommendationGood(count) },
		{ max: 6, handler: (count: number) => dependencyComplexityRecommendationModerate(count) },
		{ max: 99, handler: (count: number) => dependencyComplexityRecommendationPoor(count) },
	];

	if (dependencyComplexitySubtraction > 0) {
		template.score -= dependencyComplexitySubtraction;
		for (const { max, handler } of recommendationHandlers) {
			if (dependencyComplexitySubtraction <= max) {
				template.recommendation = handler(rawAnalysis);
				break;
			}
		}
	}

	if (template.score < 0) {
		template.score = 0;
	}
};

/** @MODIFYING
 * Handles taking the raw analysis data for coupling,
 * calculating the file's score and calling the recommendation helper
 *
 * Imports from each file that are more than 1 will penalize the template's base score of 10
 * by the import count * 2 (3 imports would be penalized by 6).
 * If the file imports from more than 3 files, it will be penalized by an additional 3 points.
 * A different recommendation is given based on the score.
 * If the score goes below 0, it is offset to 0.
 */
const processRawCouplingAnalysis = (
	rawAnalysis: RawAnalysis['couplingMap'],
	template: Analysis
) => {
	let couplingSubtractionScore: number = Array.from(rawAnalysis.values()).reduce((a, c) => {
		if (a > 1) {
			c += a * 2;
		}
		return c;
	}, 0);

	if (Array.from(rawAnalysis.keys()).length > 3) {
		couplingSubtractionScore += 3;
	}

	const recommendationHandlers = [
		{ max: 3, handler: () => couplingRecommendationGood() },
		{ max: 6, handler: () => couplingRecommendationModerate() },
		{ max: 99, handler: () => couplingRecommendationPoor() },
	];

	if (couplingSubtractionScore > 0) {
		template.score -= couplingSubtractionScore;
		for (const { max, handler } of recommendationHandlers) {
			if (couplingSubtractionScore <= max) {
				template.recommendation = handler();
				break;
			}
		}
	}

	if (template.score < 0) {
		template.score = 0;
	}
};

/**
 * Responsible for taking the import map, normalizing import rates and
 * creating a map where each key is the file imported from and the value is the
 * number of imports from that file.
 */
const getCouplingMap = (importMap: NormalizedImport[]): Map<string, number> => {
	const couplingMap = new Map<string, number>();

	importMap.map(({ import: importName, module: moduleName }) => {
		if (importName.startsWith('{')) {
			const cleanedImport = importName.replace('{ ', '').replace(' }', '');
			const allImports = cleanedImport.split(', ');
			return couplingMap.set(moduleName, allImports.length);
		}
		return couplingMap.set(moduleName, 1);
	});

	return couplingMap;
};

/**
 * Responsible for capturing circular dependencies between file by matching their
 * normalized names. For each file, all files where it imports from will be
 * traversed and it will be identified whether the imported file also imports the original
 * one, therefore creating a potential circular dependency.
 */
const getCircularDependencies = (
	sourceFileImport: FileImports,
	fileImports: FileImports[]
): CircularDependencyRaw => {
	let circularDepRawData: CircularDependencyRaw = {
		count: 0,
		between: [],
	};

	const normalizedSourceName = normalizeString(sourceFileImport.fileName);
	const dependantModules = sourceFileImport.importMap.map(({ module: moduleName }) =>
		normalizeString(moduleName)
	);

	for (const fileImport of fileImports) {
		const normalizedName = normalizeString(fileImport.fileName);

		if (!dependantModules.includes(normalizedName)) continue;

		const innerDeps = fileImport.importMap.map(({ module: moduleName }) =>
			normalizeString(moduleName)
		);
		if (innerDeps.includes(normalizeString(sourceFileImport.fileName))) {
			circularDepRawData.count += 1;
			circularDepRawData.between.push([normalizedSourceName, normalizedName]);
		}
	}

	return circularDepRawData;
};
