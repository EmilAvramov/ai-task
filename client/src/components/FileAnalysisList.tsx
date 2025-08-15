import { FileAnalysis } from '@types-http-api';
import { FileAnalysisTile } from './FileAnalysisTile';

interface FileAnalysisListProps {
	fileList: FileAnalysis[];
}

export const FileAnalysisList: React.FC<FileAnalysisListProps> = ({
	fileList,
}): React.JSX.Element => {
	return (
		<>
			{fileList.map((file, idx) => (
				<FileAnalysisTile
					key={idx}
					file={file}
				/>
			))}
		</>
	);
};
