import express from 'express';
import helmet from 'helmet';
import ServerStatusController from '../controller/ServerStatus';
import FileAnalysisControler from '../controller/FileAnalysis';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/status', ServerStatusController);
app.use('/analysis', FileAnalysisControler);

export default app;
