import React, { useEffect, useState } from 'react';
import { AnalysisAPI } from '../api';

export const Home = (): React.JSX.Element => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [api, setApi] = useState<AnalysisAPI | null>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files?.length) {
			setSelectedFile(event.target.files[0]);
		}
	};

	const handleFileUpload = async () => {
		if (!selectedFile) {
			alert('Please select a file first');
			return;
		}

		if (!api) return;

		try {
			const formData = new FormData();
			formData.append('file', selectedFile);
			const response = await api.getAnalysis(formData);
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		if (!api) {
			const initAPI = async () => {
				const backendAPI = new AnalysisAPI();
				const res = await backendAPI.getServerStatus();
				if (res.data.status === 'healthy') {
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
					type='file'
					onChange={handleFileChange}
				/>
				<button onClick={handleFileUpload}>Upload File</button>
			</div>
		</main>
	);
};
