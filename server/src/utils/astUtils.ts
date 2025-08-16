import { NormalizedImport } from '@types-parser-helpers';
import ts from 'typescript';
import { scriptMap } from '../config/consts';

export const compileSourceFile = (
	fileName: string,
	extension: string,
	contents: string
): ts.SourceFile => {
	const scriptType = scriptMap[extension as keyof typeof scriptMap];

	return ts.createSourceFile(fileName, contents, ts.ScriptTarget.ESNext, true, scriptType);
};

export const processESImport = (node: ts.ImportDeclaration): NormalizedImport => {
	return {
		import: node.importClause?.getText() ?? '',
		module: node.moduleSpecifier.getText(),
	};
};

export const processCallExpression = (node: ts.CallExpression): NormalizedImport => {
	const module = node.arguments[0].getText();
	const bindings: string[] = [];

	if (ts.isVariableDeclaration(node.parent)) {
		const declaration = node.parent.name;
		if (ts.isIdentifier(declaration)) {
			bindings.push(declaration.getText());
		} else if (ts.isObjectBindingPattern(declaration)) {
			for (const el of declaration.elements) {
				if (ts.isBindingElement(el)) {
					bindings.push(el.name.getText());
				}
			}
		}
	}
	return {
		module,
		import: bindings.join(','),
	};
};
