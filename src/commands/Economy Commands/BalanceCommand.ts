import { Example, RunFunction } from "./../../interfaces/ICommand";

export const name: string = "balance";
export const category: string = "economy";
export const aliases: string[] = [];
export const description: string = "";
export const usage: string = "balance";
export const examples: Array<Example> = [
  {
    command: "",
    description: "",
  },
];
export const run: RunFunction = async (client, message, args) => {
  const EconomySchema = await client.database.load("MemberEconomy");
  const User: string = message.author.id;
  const UserCoins = await EconomySchema.findOne({ User });
};
