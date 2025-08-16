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

const processRawAnalysis = (analysis: RawAnalysis[]): FileAnalysis[] => {
	const fileAnalysis: FileAnalysis[] = [];

	analysis.forEach((rawAnalysis) => {
		const { circularDepsAnalysis, couplingAnalysis, dependencyAnalysis } = getAnalysisTemplates();

		processRawDependencyComplexityAnalysis(rawAnalysis.dependencyCount, dependencyAnalysis);
		processRawCircularDependencyAnalysis(rawAnalysis.circularDependencies, circularDepsAnalysis);
		processRawCouplingAnalysis(rawAnalysis.couplingMap, couplingAnalysis);

		fileAnalysis.push({
			fileName: rawAnalysis.fileName,
			analysis: [circularDepsAnalysis, couplingAnalysis, dependencyAnalysis],
		});
	});

	return fileAnalysis;
};

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
