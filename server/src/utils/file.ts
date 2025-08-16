import ts from 'typescript';
import { compileSourceFile, processCallExpression, processESImport } from './ast';
import type { NormalizedImport } from '@types-parser-helpers';

/**
 * The file extension of a file by spliting on the last dot (if any)
 * and slicing till the end to return the extension
 */
export const getFileExtension = (fileName: string): string | null => {
	const lastDotIndex = fileName.lastIndexOf('.');
	return lastDotIndex === -1 ? null : fileName.slice(lastDotIndex + 1);
};

/**
 * Main coordinator function responsible for calling different helpers for
 * compiling the source file, inspecting each node with recursion to
 * retrieve all import statements and calling the respective processor functions as needed
 * Note that this function relies that the file is of type JS, JSX, TS or TSX
 */
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
