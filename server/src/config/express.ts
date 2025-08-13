import express from 'express';
import helmet from 'helmet';
import ServerStatusController from '../controller/ServerStatus';
import FileAnalysisControler from '../controller/FileAnalysis';
import cors from '../middleware/cors';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/status', ServerStatusController);
app.use('/analysis', FileAnalysisControler);

export default app;
