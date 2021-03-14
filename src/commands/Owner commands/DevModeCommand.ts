import { Example, RunFunction } from "./../../interfaces/ICommand";
import { PermissionString } from "discord.js";
import fs from "fs";

export const name: string = "devmode";
export const category: string = "owner";
export const aliases: string[] = ["dev"];
export const description: string = "Enable/Disable developer mode";
export const usage: string = "devmode <yes/no style>";
export const ownerOnly: boolean = true;
export const run: RunFunction = async (client, message, args) => {
  const DevMode: boolean = client.config.devMode;
  if (!args[0]) {
    return message.channel.send(
      client.embedUtils.createSettingsEmbed(
        `Developer mode is \`${DevMode ? "Enabled" : "Disabled"}\``,
      ),
    );
  }
  const configJSON = require("./../../../config.json");
  if (client.utils.validateBoolean(args[0]) === undefined) {
    return message.channel.send(client.embedUtils.createErrorEmbed("Unknown value"));
  }
  configJSON.devMode = client.utils.validateBoolean(args[0]);

  fs.writeFileSync("./config.json", JSON.stringify(configJSON, null, 2));
  message.channel.send(
    client.embedUtils.createSettingsEmbed(
      `Developer mode set to \`${
        configJSON.devMode ? "Enabled" : "Disabled"
      }\`. Restarting bot...`,
    ),
  );
};
