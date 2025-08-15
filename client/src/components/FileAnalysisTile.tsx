import { FileAnalysis } from '@types-http-api';

interface FileAnalysisTileProps {
	file: FileAnalysis;
}

export const FileAnalysisTile: React.FC<FileAnalysisTileProps> = ({ file }) => {
	return (
		<div>
			<p>File Name: {file.fileName}</p>
			{file.analysis.map((a) => (
				<div>
					<p>Analysis Type: {a.name}</p>
					<p>Recommendation: {a.recommendation}</p>
					<p>Score: {a.score}</p>
				</div>
			))}
		</div>
	);
};
