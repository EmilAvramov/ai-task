import React, { useEffect, useRef, useState } from 'react';
import { AnalysisAPI } from '../api';
import { FileAnalysis } from '@types-http-api';
import { FileAnalysisList } from '../components/FileAnalysisList';

export const Home = (): React.JSX.Element => {
	const fileSelectRef = useRef<HTMLInputElement | null>(null);
	const [api, setApi] = useState<AnalysisAPI | null>(null);
	const [analysis, setAnalysis] = useState<FileAnalysis[]>([]);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const ref = fileSelectRef.current;

		if (ref) {
			ref.files = event.target.files;
		}
	};

	const handleFileUpload = async () => {
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
			setAnalysis(response.data.data);
			selectoRef.value = '';
		} catch (e) {
			console.log(e);
		}
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
			<div>
				<input
					ref={fileSelectRef}
					type='file'
					multiple
					onChange={handleFileChange}
				/>
				<button onClick={handleFileUpload}>Upload Files</button>
			</div>
			{analysis.length > 0 ? <FileAnalysisList fileList={analysis} /> : <></>}
		</main>
	);
};
