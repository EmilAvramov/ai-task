import { FileAnalysis } from '@types-http-api';

interface FileAnalysisTileProps {
	file: FileAnalysis;
}

export const FileAnalysisTile: React.FC<FileAnalysisTileProps> = ({ file }) => {
	return (
		<div className='section-container'>
			<p className='section-header'>File Name: {file.fileName}</p>
			{file.analysis.map((a) => (
				<div className='section-details'>
					<p>
						<strong>Analysis Type:</strong> {a.name}
					</p>
					<p>
						<strong>Recommendation:</strong> {a.recommendation}
					</p>
					<p>
						<strong>Score:</strong> {a.score}
					</p>
					<hr />
				</div>
			))}
		</div>
	);
};
