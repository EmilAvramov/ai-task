import type { NormalizedImport } from '@types-parser-helpers';
import ts from 'typescript';
import { scriptMap } from '../config/consts';

/**
 * Responsible for compiling the source file based on its extension and raw contents
 * Will capture the correct ts.ScriptKind based on the extension
 * Casting is allowed as the extension compatibility/support is already checked by
 * the controller once
 */
export const compileSourceFile = (
	fileName: string,
	extension: string,
	contents: string
): ts.SourceFile => {
	const scriptType = scriptMap[extension as keyof typeof scriptMap];

	return ts.createSourceFile(fileName, contents, ts.ScriptTarget.ESNext, true, scriptType);
};

/**
 * Takes in the ts.Node which is of type ImportDeclaration
 * and extracts its import statement name and its module name for that import
 */
export const processESImport = (node: ts.ImportDeclaration): NormalizedImport => {
	return {
		import: node.importClause?.getText() ?? '',
		module: node.moduleSpecifier.getText(),
	};
};

/**
 * Takes in the ts.Node which is of type CallExpression
 * and extracts commonJS default imports (if CallExpression is an identifier)
 * or the named exports from the CallExpression's bindings
 * Bindings/named exports are then normalized to the output format of ts.ImportDeclarations
 * Note that the node must be previously checked if it's expression is 'require
 */
export const processCallExpression = (node: ts.CallExpression): NormalizedImport => {
	const module = node.arguments[0].getText();
	let binding = '';

	if (ts.isVariableDeclaration(node.parent)) {
		const declaration = node.parent.name;
		if (ts.isIdentifier(declaration)) {
			binding = declaration.getText();
		} else if (ts.isObjectBindingPattern(declaration)) {
			const rawBindings = [];
			for (const el of declaration.elements) {
				if (ts.isBindingElement(el)) {
					rawBindings.push(el.name.getText());
				}
			}
			if (rawBindings.length) {
				binding = `{ ${rawBindings.join(', ')} }`;
			}
		}
	}

	return {
		module,
		import: binding,
	};
};
