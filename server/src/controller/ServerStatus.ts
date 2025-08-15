import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response): void => {
	try {
		res.status(200).json({ status: 'OK' });
	} catch (err: unknown) {
		res.status(400).json({ status: 'Error' });
	}
});

export default router;
