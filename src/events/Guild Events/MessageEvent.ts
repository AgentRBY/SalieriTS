import { RunFunction } from "./../../interfaces/IEvent";
import { Message } from "discord.js";
import { Command } from "../../interfaces/ICommand";
import { Database } from "../../database/Database";
import { Anything } from "./../../interfaces/IAnything";

export const name: string = "message";
export const run: RunFunction = async (client, message: Message) => {
  if (message.partial) {
    await message.fetch();
  }
  if (message.member?.partial) {
    await message.member.fetch();
  }
  const GuildSettingsSchema: Database = await client.database.load(
    "GuildSettings",
  );
  const GuildSettings: Anything = await GuildSettingsSchema.findOne({
    GuildID: message.guild.id,
  });
  const Prefix = GuildSettings?.Prefix || client.config.prefix;
  if (!message.guild) {
    return;
  }
  if (!message.content.startsWith(Prefix)) {
    return;
  }
  const args: string[] = message.content
    .slice(Prefix.length)
    .trim()
    .split(/ +/g);
  const cmd: string = args.shift();
  const command: Command =
    client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  if (!command) {
    return;
  }
  command.run(client, message, args).catch((reason: any) => {
    message.channel.send(
      client.embed({ description: `Error: ${reason}` }, message),
    ),
      client.logger.error(reason);
  });
};
