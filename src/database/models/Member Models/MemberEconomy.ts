import { model, Schema } from "mongoose";

export const name: string = "MemberEconomy";
export const data = model(
  name,
  new Schema({
    ID: String,
    Coins: Number,
    Job: String,
    DepositedCoins: Number,
  }),
);
