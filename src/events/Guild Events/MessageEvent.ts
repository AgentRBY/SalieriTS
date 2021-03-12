import { RunFunction } from "./../../interfaces/IEvent";
import { Guild, GuildMember, Message, MessageEmbed } from "discord.js";
import { Command } from "../../interfaces/ICommand";
import { Database } from "../../database/Database";
import { Anything } from "./../../interfaces/IAnything";
import { Permissions } from "./../../static/Permissions";

export const name: string = "message";
export const run: RunFunction = async (client, message: Message) => {
  if (message.partial) {
    await message.fetch();
  }
  if (message.member?.partial) {
    await message.member.fetch();
  }
  if (!message.guild || message.channel.type === "dm") {
    return;
  }
  const GuildSettingsSchema: Database = await client.database.load(
    "GuildSettings",
  );
  const GuildSettings: Anything = await GuildSettingsSchema.findOne({
    GuildID: message.guild.id,
  });
  const Prefix = GuildSettings?.Prefix || client.config.prefix;
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
  if (
    command.ownerOnly &&
    command.ownerOnly === true &&
    !client.config.ownersID.includes(message.author.id)
  ) {
    return;
  }
  if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) {
    const guildOwner: GuildMember = message.guild.owner;
    const embed: MessageEmbed = new MessageEmbed({
      description: `On your server \`${message.guild}\` in channel \`#${message.channel.name}\`, I don't have permission to send messages. Please give me \`Send messages\` permission, for the bot to work in this channel`,
    });
    return guildOwner.send(embed);
  }
  if (
    command.memberPermissions &&
    !message.channel
      .permissionsFor(message.member)
      .has(command.memberPermissions)
  ) {
    const embed: MessageEmbed = new MessageEmbed({
      description: `You don't have enough permissions, you need: ${command.memberPermissions
        .map((value) => {
          return `\`${Permissions[value]}\``;
        })
        .join(", ")}`,
    });
    return message.channel.send(embed);
  }
  if (
    command.botPermissions &&
    !message.channel
      .permissionsFor(message.guild.me)
      .has(command.botPermissions)
  ) {
    const embed: MessageEmbed = new MessageEmbed({
      description: `I don't have enough permissions, me need: ${command.botPermissions
        .map((value) => {
          return `\`${Permissions[value]}\``;
        })
        .join(", ")}`,
    });
    return message.channel.send(embed);
  }
  command.run(client, message, args).catch((reason: any) => {
    message.channel.send(
      client.embed({ description: `Error: ${reason}` }, message),
    ),
      client.logger.error(reason);
  });
};
