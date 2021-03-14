import { Example, RunFunction } from "./../../interfaces/ICommand";
import { MessageEmbed, PermissionString } from "discord.js";
import { inspect } from "util";
import { colors } from "../../static/BotConfig";

export const name: string = "eval";
export const category: string = "owner";
export const aliases: string[] = [];
export const description: string = "";
export const usage: string = "eval <code>";
export const examples: Array<Example> = [
  {
    command: "",
    description: "",
  },
];
export const memberPermissions: Array<PermissionString> = [];
export const botPermissions: Array<PermissionString> = [];
export const ownerOnly: boolean = false;
export const run: RunFunction = async (client, message, args) => {
  if (!args.length) {
    return message.channel.send(client.embed({ description: "Please provide some code" }, message));
  }
  try {
    const result = await eval(args.join(" "));
    let response = await await result;
    let footer = "";
    if (typeof response != "string") {
      response = inspect(result);
    }
    if (response.includes(client.token)) {
      response = response.replace(client.token, "token");
    }
    if (response.includes(client.config.mongoURI)) {
      response = response.replace(client.config.mongoURI, "mongouri");
    }
    if (response.length > 1950) {
      response = response.slice(0, 1950) + "...";
      footer = "cropped";
    }
    const embed = new MessageEmbed()
      .setDescription(response)
      .setColor(colors.Green)
      .setFooter(footer);
    await message.channel.send(embed);
  } catch (error) {
    error = error.message
      .replace(client.token, "token")
      .replace(client.config.mongoURI, "mongouri");
    let footer = "";
    if (error.length > 1950) {
      error = error.slice(0, 1950) + "...";
      footer = "cropped";
    }
    const embed = new MessageEmbed().setDescription(error).setColor(colors.Red).setFooter(footer);
    return message.channel.send(embed);
  }
};
