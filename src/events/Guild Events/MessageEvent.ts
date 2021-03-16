import { RunFunction } from "./../../interfaces/IEvent";
import { Guild, GuildMember, Message, MessageEmbed, TextChannel } from "discord.js";
import { Command } from "../../interfaces/ICommand";
import { Database } from "../../database/Database";
import { Anything } from "./../../interfaces/IAnything";
import { Permissions } from "./../../static/Permissions";
import { defaultSettings } from "../../static/BotConfig";

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
  const GuildSettingsSchema: Database = await client.database.load("GuildSettings");
  const GuildSettings: Anything = await GuildSettingsSchema.findOne({
    GuildID: message.guild.id,
  });
  const Prefix = GuildSettings?.Prefix || defaultSettings.Prefix;
  if (!message.content.startsWith(Prefix)) {
    return;
  }
  const args: string[] = message.content.slice(Prefix.length).trim().split(/ +/g);
  const cmd: string = args.shift();
  const command: Command =
    client.commands.get(cmd.toLowerCase()) ||
    client.commands.get(client.aliases.get(cmd.toLowerCase()));
  if (!command) {
    return;
  }
  if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) {
    const guildOwner: GuildMember = message.guild.owner;
    return guildOwner.send(
      client.embedUtils.createErrorEmbed(
        `On your server \`${message.guild}\` in channel \`#${message.channel.name}\`, I don't have permission to send messages. 
        Please give me \`Send messages\` permission, for the bot to work in this channel`,
      ),
    );
  }
  if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
    return message.channel.send(
      "I don't have permission to send Embed messages. Please, give me `Embed Links` permission",
    );
  }
  if (!message.channel.permissionsFor(message.guild.me).has("USE_EXTERNAL_EMOJIS")) {
    return message.channel.send(
      "I don't have permission to send external emoji. Please, give me `Use external emojis` permission",
    );
  }
  if (client.config.devMode && !client.config.ownersID.includes(message.author.id)) {
    return message.channel.send(
      client.embedUtils.createSettingsEmbed(
        "Developer mode enabled. For common users, commands don't work",
      ),
    );
  }
  if (command.ownerOnly && !client.config.ownersID.includes(message.author.id)) {
    return message.channel.send(
      client.embedUtils.createErrorEmbed("You don't have enough permissions for that"),
    );
  }
  if (
    command.memberPermissions?.length &&
    !message.channel.permissionsFor(message.member).has(command.memberPermissions)
  ) {
    return message.channel.send(
      client.embedUtils.createErrorEmbed(
        `You don't have enough permissions for that, you need: ${command.memberPermissions
          .map((value) => {
            return `\`${Permissions[value]}\``;
          })
          .join(", ")}`,
      ),
    );
  }
  if (
    command.botPermissions?.length &&
    !message.channel.permissionsFor(message.guild.me).has(command.botPermissions)
  ) {
    return message.channel.send(
      client.embedUtils.createErrorEmbed(
        `I don't have enough permissions for that, me need: ${command.botPermissions
          .map((value) => {
            return `\`${Permissions[value]}\``;
          })
          .join(", ")}`,
      ),
    );
  }
  command.run(client, message, args).catch((error: any) => {
    message.channel.send(
      client.embedUtils.createErrorEmbed(
        `Error: \`\`\`ts\n${error}\`\`\` \n${
          client.config.reportErrors ? "Reported to developers" : ""
        }`,
      ),
    );
    if (client.config.reportErrors) {
      client.config.ownersID.forEach((ownerID) => {
        client.users.cache.get(ownerID).send(
          client.embedUtils.createErrorEmbed(
            `An error occurred in the command \`${Prefix}${
              command.name
            }\`, on the server \`${message.guild}\` in the channel \`${
              (message.channel as TextChannel).name
            }\`.
            Error: \`\`\`ts\n${error}\`\`\``,
          ),
        );
      });
    }
  });
};
