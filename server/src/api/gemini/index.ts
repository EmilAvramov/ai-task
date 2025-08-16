import { GoogleGenAI } from '@google/genai';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

interface GeminiApiResponse {
	candidates: Answer[];
}

interface Answer {
	content: {
		parts: [{ text: string }];
	};
	modelVersion: string;
	responseId: string;
}

export class GeminiAPI {
	client: AxiosInstance;

	constructor() {
		this.client = this.init();
	}

	/**
	 * Responsible for initializing the client with its configuration
	 * Setting the content type and adding an interceptor for error handling
	 */
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

	/**
	 * Calls the google generative API with a text (representing a prompt)
	 * Note that the API version can be changed (e.g. to gemini-2.0-flash)
	 * as permissive by the API Key
	 */
	queryGeminiAPI = async (text: string): Promise<AxiosResponse<GeminiApiResponse>> => {
		return await this.client.post('gemini-2.5-flash:generateContent', {
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
