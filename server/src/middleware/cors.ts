import type { Request, Response, NextFunction } from 'express';

const cors =
	() =>
	(req: Request, res: Response, next: NextFunction): void => {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD');
		res.setHeader('Access-Control-Allow-Headers', 'content-type');
		next();
	};

export default cors;
