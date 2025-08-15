import { AnalysisResponse, ServerStatusResponse } from '@types-http-api';
import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

const CONFIGS = {
	URL: 'http://localhost:8080',
};

export class AnalysisAPI {
	client: AxiosInstance;

	constructor() {
		this.client = this.init();
	}

	private init = () => {
		const instance = axios.create({
			baseURL: CONFIGS.URL,
		});

		instance.interceptors.response.use(
			(res) => res,
			(err) => {
				if (err instanceof AxiosError) {
					console.log(JSON.stringify(err.response));
				} else if (err instanceof Error) {
					console.log(JSON.stringify(err.message));
				}
			}
		);

		return instance;
	};

	getServerStatus = async (): Promise<AxiosResponse<ServerStatusResponse>> => {
		return await this.client.get(`/status`, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
	};

	getAnalysis = async (payload: FormData): Promise<AxiosResponse<AnalysisResponse>> => {
		return await this.client.post(`/analysis`, payload, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	};
}
