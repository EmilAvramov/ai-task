import { FileAnalysis } from '@types-http-api';
import { FileAnalysisTile } from './FileAnalysisTile';

interface FileAnalysisListProps {
	source: string;
	fileList: FileAnalysis[];
}

export const FileAnalysisList: React.FC<FileAnalysisListProps> = ({
	source,
	fileList,
}): React.JSX.Element => {
	return (
		<div className='section'>
			<div className='section-title'>Analysis Source: {source}</div>
			{fileList.map((file, idx) => (
				<FileAnalysisTile
					key={idx}
					file={file}
				/>
			))}
		</div>
	);
};
