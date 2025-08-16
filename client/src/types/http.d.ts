declare module '@types-http-api' {
	interface ServerStatusResponse {
		status: 'OK' | 'Error';
	}

	interface AnalysisResponse extends ServerStatusResponse {
		data: FileAnalysis[];
	}

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
