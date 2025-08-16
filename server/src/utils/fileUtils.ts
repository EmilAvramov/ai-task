import ts from 'typescript';
import { compileSourceFile, processCallExpression, processESImport } from './astUtils';
import { ImportCandidate, NormalizedImport } from '@types-parser-helpers';

export const getFileExtension = (fileName: string): string | null => {
	const lastDotIndex = fileName.lastIndexOf('.');
	return lastDotIndex === -1 ? null : fileName.slice(lastDotIndex + 1);
};

export const extractImports = (fileName: string, contents: string): NormalizedImport[] => {
	const extension = getFileExtension(fileName);

	if (!extension) throw new Error('Was unable to capture extension');

	const sourceFile = compileSourceFile(fileName, extension, contents);

	const imports: NormalizedImport[] = [];

	const inspectNode = (node: ts.Node) => {
		if (ts.isImportDeclaration(node)) {
			imports.push(processESImport(node));
		} else if (
			ts.isCallExpression(node) &&
			ts.isIdentifier(node.expression) &&
			node.expression.text === 'require'
		) {
			imports.push(processCallExpression(node));
		}
		ts.forEachChild(node, inspectNode);
	};

	inspectNode(sourceFile);

	return imports;
};
