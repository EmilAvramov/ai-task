import ts from 'typescript';

export const getFileExtension = (fileName: string): string | null => {
	const lastDotIndex = fileName.lastIndexOf('.');

	if (lastDotIndex === -1) {
		return null;
	}

	return fileName.slice(lastDotIndex + 1);
};

export const extractImports = (fileName: string, contents: string): ts.ImportDeclaration[] => {
	const sourceFile = ts.createSourceFile(fileName, contents, ts.ScriptTarget.Latest, true);

	const imports: ts.ImportDeclaration[] = [];
	ts.forEachChild(sourceFile, (node) => {
		if (ts.isImportDeclaration(node)) {
			imports.push(node);
		}
	});

	return imports;
};

export const createImportMap = (nodes: ts.ImportDeclaration[]) => {
	return nodes.map((n) => ({
		import: n.importClause?.getText(),
		module: n.moduleSpecifier.getText(),
	}));
};
