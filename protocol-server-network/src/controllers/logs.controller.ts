import { Request, Response } from 'express';
import { LogModel, Log } from '../models/logs.model';

export class LogsController {
  static async getLogsByTransactionId(req: Request, res: Response) {
    try {
      const { transaction_id } = req.query;

      if (!transaction_id) {
        return res.status(400).json({ error: 'Transaction ID is required in the query parameters' });
      }

      await LogModel.connectToDatabase();
      const logs: Log[] = await LogModel.findLogsByTransactionId(String(transaction_id));

      res.status(200).json(logs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}