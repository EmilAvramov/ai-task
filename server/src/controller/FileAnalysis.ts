import { Router } from 'express';
import type { Request, Response } from 'express';
import { upload } from '../middleware/multer';
import { createImportMap, extractImports, getFileExtension } from '../utils/fileUtils';
import { supportedFileTypes } from '../config/consts';
import { GeminiAPI } from '../api/gemini';

const router = Router();

router.post('/', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
	try {
		const file = req.file;
		if (!file) {
			res.status(400).json({ error: 'File not provided' });
			return;
		}

		const extType = getFileExtension(file.originalname);
		if (!extType || !supportedFileTypes.includes(extType)) {
			res.status(400).json({ error: 'File type not supported' });
			return;
		}

		const contents = file.buffer.toString('utf-8');

		const importMap = createImportMap(extractImports(file.filename, contents));

		console.log(importMap);

		// const api = new GeminiAPI();
		// const response = await api.queryGeminiAPI('what is typescript');

		// console.log(response.data.candidates[0].content.parts[0]);

		res.status(200).json({ status: 'OK' });
	} catch (err: unknown) {
		res.status(400).json({ status: 'Error' });
	}
});

export default router;
