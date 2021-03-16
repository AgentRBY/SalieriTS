import { Bot } from "../client/Client";
import { Message, PermissionString } from "discord.js";

export interface RunFunction {
  (client: Bot, message: Message, args: string[]): Promise<unknown>;
}

export interface Command {
  name: string;
  module: string;
  aliases?: string[];
  description?: string;
  usage?: string;
  examples?: Array<Example>;
  ownerOnly?: boolean;
  memberPermissions?: Array<PermissionString>;
  botPermissions?: Array<PermissionString>;
  run: RunFunction;
}

export interface Example {
  command: string;
  description: string;
}
