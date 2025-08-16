import type {
	Analysis,
	FileAnalysis,
	FileImports,
	NormalizedImport,
	RawAnalysis,
} from '@types-parser-helpers';

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

const normalizeString = (input: string) =>
	input.replace(/\'/g, '').replace('./', '').replace('.ts', '').replace('.js', '');

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
): number => {
	let circularDependencies = 0;

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
			circularDependencies += 1;
		}
	}

	return circularDependencies;
};
