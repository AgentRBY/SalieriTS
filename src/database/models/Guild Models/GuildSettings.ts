import { model, Schema } from "mongoose";

export const name: string = "GuildSettings";
export const data = model(
  name,
  new Schema({
    GuildID: String,
    Prefix: String,
  }),
);
