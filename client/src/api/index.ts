import { AnalysisResponse, ServerStatusResponse } from '@types-http-api';
import axios from 'axios';
import type { AxiosResponse } from 'axios';

const CONFIGS = {
	URL: 'http://localhost:8080',
};

export class AnalysisAPI {
	getServerStatus = async (): Promise<AxiosResponse<ServerStatusResponse>> => {
		return await axios.get(`${CONFIGS.URL}/status`);
	};

	getAnalysis = async (payload: FormData): Promise<AxiosResponse<AnalysisResponse>> => {
		return await axios.post(`${CONFIGS.URL}/analysis`, payload);
	};
}
