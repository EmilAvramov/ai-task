import React, { useEffect, useState } from 'react';
import { AnalysisAPI } from '../api';

export const Home = (): React.JSX.Element => {
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [api, setApi] = useState<AnalysisAPI | null>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files?.length) {
			setSelectedFiles(Array.from(files));
		}
	};

	const handleFileUpload = async () => {
		if (!selectedFiles.length) {
			alert('Please select at least one file first');
			return;
		}

		if (!api) return;

		try {
			const formData = new FormData();

			selectedFiles.forEach((file) => {
				formData.append('files', file);
			});

			await api.getAnalysis(formData);
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
					multiple
					onChange={handleFileChange}
				/>
				<button onClick={handleFileUpload}>Upload Files</button>
			</div>
		</main>
	);
};
