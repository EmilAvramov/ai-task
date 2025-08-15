import { Router } from 'express';
import type { Request, Response } from 'express';
import { upload } from '../middleware/multer';
import { createImportMap, extractImports, getFileExtension } from '../utils/fileUtils';
import { supportedFileTypes } from '../config/consts';
import { GeminiAPI } from '../api/gemini';
import { analyseComplexity } from '../api/gemini/prompts';

const router = Router();

router.post('/', upload.array('files'), async (req: Request, res: Response): Promise<void> => {
	try {
		const files = req.files as Express.Multer.File[] | undefined;

		if (!files?.length) {
			res.status(400).json({ error: 'Files not provided' });
			return;
		}

		const allFilesSupported = files.every((file) => {
			const extType = getFileExtension(file.originalname);
			return extType && supportedFileTypes.includes(extType);
		});
		if (!allFilesSupported) {
			res.status(400).json({ error: 'Not all file types provided are supported' });
			return;
		}

		const fileImports = files.map((f) => {
			const contents = f.buffer.toString('utf-8');
			const importMap = createImportMap(extractImports(f.originalname, contents));
			return { fileName: f.originalname, importMap };
		});

		const api = new GeminiAPI();
		const response = await api.queryGeminiAPI(analyseComplexity(JSON.stringify(fileImports)));

		const jsonString = response.data.candidates[0].content.parts[0].text
			.replace(/^```json\n/, '')
			.replace(/\n```$/, '');

		res.status(200).json({ data: JSON.parse(jsonString), status: 'OK' });
	} catch (err: unknown) {
		console.log(err);
		res.status(400).json({ status: 'Error' });
	}
});

export default router;
