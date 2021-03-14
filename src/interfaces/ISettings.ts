import { Bot } from "../client/Client";
import { Message } from "discord.js";
import { Anything } from "./IAnything";

export interface Setting {
  name: string;
  parameter: string;
  description: string;
  validate: (client: Bot, message: Message, args: string[]) => ValidationResponse;
  value: (client: Bot, message: Message, args: string[]) => any;
  default: string;
  current: (GuildSettings: Anything) => string;
}

export interface ValidationResponse {
  value: boolean;
  fix: string;
  success: boolean;
}
