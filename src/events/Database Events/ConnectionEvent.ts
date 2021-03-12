import { RunFunction } from "../../interfaces/IEvent";
import mongoose from "mongoose";
import { EventEmitter } from "events";

export const name: string = "connected";
export const run: RunFunction = async (client) => {
  client.logger.success(`MongoDB connected`);
};
export const emitter: EventEmitter = mongoose.connection;
