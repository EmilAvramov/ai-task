declare module '@types-http-api' {
	interface ServerStatusResponse {
		status: 'healthy' | 'not healthy';
	}

	interface AnalysisResponse {
		data: string;
	}
}
