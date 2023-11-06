import { Router } from 'express';
import { Request, Response } from 'express-serve-static-core';
import fs from 'fs';

const logsRouter = Router();

logsRouter.get('/:logLevel', (req: Request, res: Response) => {
  const { logLevel } = req.params;
  const messageId = req.query.message_id as string;
  const date = req.query.date as string;
  const logFileName = `logs/${logLevel}/${date}.log`;

  fs.readFile(logFileName, 'utf8', (err: NodeJS.ErrnoException | null, data: string) => {
    if (err) {
      res.status(500).json({ error: 'Log file not found or could not be read.' });
    } else {
      const logLines = data.split('\n');
      const logsWithMessageId = logLines.filter((logLine) => logLine.includes(`"message_id":"${messageId}"`));
      const logData = {
        logs: logsWithMessageId,
      };

      res.json(logData);
    }
  });
});

export default logsRouter;
