declare module '@types-parser-helpers' {
	import ts from 'typescript';
	interface NormalizedImport {
		module: string;
		import: string;
	}

	interface FileImports {
		fileName: string;
		importMap: NormalizedImport[];
	}

	type ImportCandidate = ts.ImportDeclaration | ts.CallExpression;

	interface FileAnalysis {
		fileName: string;
		analysis: Analysis[];
	}

	interface Analysis {
		name: 'dependencies' | 'circular' | 'coupling';
		score: number;
		recommendation: string;
	}
}
