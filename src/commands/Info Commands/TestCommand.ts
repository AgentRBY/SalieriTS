import { Example, RunFunction } from "./../../interfaces/ICommand";
import { PermissionString } from "discord.js";

export const name: string = "test";
export const category: string = "info";
export const aliases: string[] = [];
export const description: string = "123";
export const usage: string = "test";
export const examples: Array<Example> = [
  {
    command: "",
    description: "",
  },
];
export const memberPermissions: Array<PermissionString> = [];
export const botPermissions: Array<PermissionString> = [];
export const ownerOnly: boolean = true;
export const run: RunFunction = async (client, message, args) => {
  client.logger.info("test");
};
