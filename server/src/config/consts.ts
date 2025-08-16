import ts from 'typescript';

/**
 * Support object to correlate the different extensions to their ts.ScriptKind
 */
export const scriptMap = {
	ts: ts.ScriptKind.TS,
	tsx: ts.ScriptKind.TSX,
	js: ts.ScriptKind.JS,
	jsx: ts.ScriptKind.JSX,
};
