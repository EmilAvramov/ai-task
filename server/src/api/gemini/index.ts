import { GoogleGenAI } from '@google/genai';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

export class GeminiAPI {
	client: AxiosInstance;

	constructor() {
		this.client = this.init();
	}

	private init = () => {
		const baseUrl = process.env.GEMINI_BASE_URL;
		const apiKey = process.env.GEMINI_API_KEY;
		if (!baseUrl || !apiKey) {
			throw new Error('Missing Gemini API Configuration');
		}

		const instance = axios.create({
			baseURL: baseUrl,
			headers: {
				'Content-Type': 'application/json',
				'X-goog-api-key': apiKey,
			},
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

	queryGeminiAPI = async (text: string): Promise<AxiosResponse> => {
		return await this.client.post('gemini-2.0-flash:generateContent', {
			contents: [
				{
					parts: [
						{
							text,
						},
					],
				},
			],
		});
	};
}
