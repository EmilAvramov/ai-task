import React, { useEffect, useRef, useState } from 'react';
import { AnalysisAPI } from '../api';
import { FileAnalysis } from '@types-http-api';
import { FileAnalysisList } from '../components/FileAnalysisList';

export const Home = (): React.JSX.Element => {
	const fileSelectRef = useRef<HTMLInputElement | null>(null);
	const [api, setApi] = useState<AnalysisAPI | null>(null);
	const [llmAnalysis, setLLMAnalysis] = useState<FileAnalysis[]>([]);
	const [heuristicAnalysis, setHeuristicAnalysis] = useState<FileAnalysis[]>([]);
	const [loading, setLoading] = useState(false);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const ref = fileSelectRef.current;

		if (ref) {
			ref.files = event.target.files;
		}
	};

	const handleFileUpload = async () => {
		setLoading(true);
		const selectoRef = fileSelectRef.current;

		if (!selectoRef?.files?.length) {
			alert('Please select at least one file first');
			return;
		}

		if (!api) return;

		try {
			const formData = new FormData();

			console.log(selectoRef.files);
			Array.from(selectoRef.files).forEach((file) => {
				formData.append('files', file);
			});

			const response = await api.getAnalysis(formData);
			setLLMAnalysis(response.data.data.llm);
			setHeuristicAnalysis(response.data.data.heuristic);
			selectoRef.value = '';
		} catch (e) {
			console.log(e);
		}
		setLoading(false);
	};

	useEffect(() => {
		if (!api) {
			const initAPI = async () => {
				const backendAPI = new AnalysisAPI();
				const res = await backendAPI.getServerStatus();
				if (res.data.status === 'OK') {
					setApi(backendAPI);
				} else {
					alert('Failed to connect to backend server');
				}
			};
			void initAPI();
		}
	}, [api]);

	return (
		<main>
			<div className='input-container'>
				<input
					ref={fileSelectRef}
					type='file'
					multiple
					onChange={handleFileChange}
					disabled={loading}
				/>
				<button
					disabled={loading}
					onClick={handleFileUpload}
				>
					{loading ? 'Loading...' : 'Upload Files'}
				</button>
			</div>
			<div className='content-container'>
				{llmAnalysis.length > 0 ? (
					<FileAnalysisList
						fileList={llmAnalysis}
						source='Gemini 2.5 LLM'
					/>
				) : (
					<></>
				)}
				{heuristicAnalysis.length > 0 ? (
					<FileAnalysisList
						fileList={heuristicAnalysis}
						source='Heuristic'
					/>
				) : (
					<></>
				)}
			</div>
		</main>
	);
};
