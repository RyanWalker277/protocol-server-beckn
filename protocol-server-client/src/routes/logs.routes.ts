
import { Router } from 'express';
import { LogsController } from '../controllers/logs.controller';

const router = Router();

router.get('/logs/byTransactionId', LogsController.getLogsByTransactionId); // New route

export default router;