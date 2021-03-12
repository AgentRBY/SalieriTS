import { Bot } from "../client/Client";
import { Schema } from "./../interfaces/ISchema";
import { Document } from "mongoose";

class Database {
  private schema: Schema;
  public constructor(schema: Schema) {
    this.schema = schema;
  }

  public async update(find: object, update: object): Promise<Document> {
    const existingData = await this.schema.data.findOne(find);
    if (!existingData) {
      return this.create({ ...find, ...update });
    }

    Object.entries(update).map((value) => {
      existingData[value[0]] = value[1];
    });
    await existingData.save();
    return existingData;
  }

  public async create(data: object): Promise<Document> {
    const NewModel = new this.schema.data(data);
    await NewModel.save();
    return NewModel;
  }

  public async findOne(data: object): Promise<Document> {
    const Data = await this.schema.data.findOne(data);
    return Data;
  }
}

class DatabaseManager {
  private client: Bot;
  public constructor(client: Bot) {
    this.client = client;
    this.client.logger.info(`Database has been constructed`);
  }
  public async load(schema: string) {
    const Model: Schema = this.client.schemas.get(schema);
    return new Database(Model);
  }
}

export { DatabaseManager, Database };
