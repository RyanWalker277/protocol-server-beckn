import { Db, Collection, FindOptions } from 'mongodb';
import { getConfig } from '../utils/config.utils';
import { DBClient } from '../utils/mongo.utils'; // Import the DBClient class

export interface Log {
  message: string;
  timestamp: Date;
}

export class LogModel {
  private static dbClient: DBClient;
  private static db: Db;

  static async connectToDatabase(): Promise<void> {
    this.dbClient = new DBClient(getConfig().responseCache.mongoURL!);
    await this.dbClient.connect();
    this.db = this.dbClient.getDB();
  }

  static async logMessage(message: string): Promise<void> {
    if (!this.dbClient || !this.dbClient.isConnected) {
      throw new Error('Mongo client is not connected.');
    }

    const logCollection = this.db.collection('logs');
    const timestamp = new Date();

    await logCollection.insertOne({ message, timestamp });
  }

  static async findLogsByTransactionId(transactionId: string): Promise<Log[]> {
    if (!this.dbClient || !this.dbClient.isConnected) {
      throw new Error('Mongo client is not connected.');
    }
  
    const logCollection: Collection<Log> = this.db.collection('logs');
  
    const filter: { meta: { transactionId: string } } = { meta: { transactionId } };
  
    const logs: Log[] = await logCollection
      .find(filter)
      .sort({ timestamp: 1 })
      .toArray();
    
    console.log(filter)

    return logs;
  }
}
