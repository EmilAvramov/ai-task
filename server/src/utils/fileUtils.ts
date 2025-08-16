import ts from 'typescript';
import { compileSourceFile, processCallExpression, processESImport } from './astUtils';
import { ImportCandidate } from '@types-parser-helpers';

export const getFileExtension = (fileName: string): string | null => {
	const lastDotIndex = fileName.lastIndexOf('.');
	return lastDotIndex === -1 ? null : fileName.slice(lastDotIndex + 1);
};

export const extractImports = (fileName: string, contents: string): ImportCandidate[] => {
	const extension = getFileExtension(fileName);

	if (!extension) throw new Error('Was unable to capture extension');

	const sourceFile = compileSourceFile(fileName, extension, contents);

	const imports: ImportCandidate[] = [];

	const inspectNode = (node: ts.Node) => {
		if (ts.isImportDeclaration(node)) {
			imports.push(node);
		} else if (
			ts.isCallExpression(node) &&
			ts.isIdentifier(node.expression) &&
			node.expression.text === 'require'
		) {
			imports.push(node);
		}
		ts.forEachChild(node, inspectNode);
	};

	inspectNode(sourceFile);

	return imports;
};

export const createImportMap = (nodes: ImportCandidate[]) => {
	const importMap: Array<{ import: string; module: string }> = [];

	nodes.forEach((node) => {
		if (ts.isImportDeclaration(node)) {
			importMap.push(processESImport(node));
		} else if (
			ts.isCallExpression(node) &&
			ts.isIdentifier(node.expression) &&
			node.expression.text === 'require'
		) {
			importMap.push(processCallExpression(node));
		}
	});

	return importMap;
};
