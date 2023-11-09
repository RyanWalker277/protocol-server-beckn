import { Router, Request, Response, NextFunction } from "express";
import { testController } from "../controllers/test.controller";
import { authValidatorMiddleware } from "../middlewares/auth.middleware";
import { setTransactionIdFromRequest } from "../utils/logger.utils";
import { LogModel, Log } from "../models/log.model";

const testRouter = Router();

testRouter.post('/', authValidatorMiddleware, (req: Request, res: Response, next: NextFunction) => {
  setTransactionIdFromRequest(req);
  authValidatorMiddleware(req, res, (err?: any) => {
    if (err) {
      return next(err);
    }
    testController(req, res, next);
  });
});

export default testRouter;