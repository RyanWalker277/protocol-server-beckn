import { Response } from "express";
import { Exception, ExceptionType } from "../models/exception.model";
import { RequestActions } from "../schemas/configs/actions.app.config.schema";
import { ClientConfigType } from "../schemas/configs/client.config.schema";
import { SyncCache } from "./cache/sync.cache.utils";
import { getConfig } from "./config.utils";

export async function sendSyncResponses(res: Response, message_id: string, action: RequestActions, context: any) {
    try {
        if (getConfig().client.type !== ClientConfigType.synchronous) {
            throw new Exception(ExceptionType.Client_InvalidCall, "Synchronous client is not configured.", 500);
        }

        const syncCache = SyncCache.getInstance();
        syncCache.initCache(message_id, action);

        const waitTime = getConfig().app.actions.requests[action]?.ttl || 30 * 1000;
        
        for (let i = 0; i <= waitTime; i += 1000) {
            await sleep(1000);

            const syncCacheData = await syncCache.getData(message_id, action);
            if (!syncCacheData || syncCacheData.error) {
                const errorMessage = syncCacheData
                    ? `Sync cache data not found for message_id: ${message_id} and action: ${action}`
                    : "Unknown error occurred.";
                throw new Exception(ExceptionType.Client_SyncCacheDataNotFound, errorMessage, 404);
            }

            if (syncCacheData.responses?.length || i >= waitTime) {
                if (i >= waitTime && !syncCacheData.responses?.length) {
                    res.status(408).json({
                        context,
                        error: "Request Timeout: Bank server didn't return any data."
                    });
                    return;
                }

                res.status(200).json({
                    context,
                    responses: syncCacheData.responses
                });
                return;
            }
        }
    } catch (error) {
        if (error instanceof Exception) {
            throw error;
        }

        throw new Exception(ExceptionType.Client_SendSyncReponsesFailed, "Send Synchronous Responses Failed.", 500, error);
    }
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}