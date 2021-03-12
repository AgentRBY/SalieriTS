import { Example, RunFunction } from "./../../interfaces/ICommand";
import { Anything } from "./../../interfaces/IAnything";
import { MessageEmbed } from "discord.js";
import { Database } from "../../database/Database";

export const name: string = "prefix";
export const category: string = "settings";
export const aliases: string[] = [];
export const description: string = "";
export const usage: string = "prefix";
export const examples: Array<Example> = [
  {
    command: "",
    description: "",
  },
];
export const run: RunFunction = async (client, message, args) => {
  const GuildSettingsSchema: Database = await client.database.load(
    "GuildSettings",
  );
  const GuildSettings: Anything = await GuildSettingsSchema.findOne({
    GuildID: message.guild.id,
  });

  const Prefix = GuildSettings?.Prefix || client.config.prefix;
  if (!args[0]) {
    const embed: MessageEmbed = new MessageEmbed({
      description: `The prefix is \`${Prefix}\``,
    });
    return message.channel.send(embed);
  }
  if (args[0].length > 3) {
    const embed: MessageEmbed = new MessageEmbed({
      description: `The prefix can't be no more than 3 characters`,
    });
    message.channel.send(embed);
  }
  await GuildSettingsSchema.update(
    { GuildID: message.guild.id },
    { Prefix: args[0] },
  );
  const embed: MessageEmbed = new MessageEmbed({
    description: `Set the prefix to \`${args[0]}\``,
  });
  message.channel.send(embed);
};
