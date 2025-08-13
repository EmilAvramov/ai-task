import { Router } from 'express';
import type { Request, Response } from 'express';
import { upload } from '../middleware/multer';

const router = Router();

router.post('/', upload.single('file'), (req: Request, res: Response): void => {
	try {
		console.log(req.file);
		res.status(200).json({ status: 'OK' });
	} catch (err: unknown) {
		res.status(400).json({ status: 'Error' });
	}
});

export default router;
