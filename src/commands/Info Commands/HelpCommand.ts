import { Command, Example, RunFunction } from "./../../interfaces/ICommand";
import { EmbedFieldData, MessageEmbed, MessageEmbedFooter } from "discord.js";
import { Database } from "../../database/Database";
import { Anything } from "./../../interfaces/IAnything";
import { defaultSettings, emojisLinks } from "../../static/BotConfig";
import { emojis, colors } from "./../../static/BotConfig";
import { Module } from "./../../interfaces/IModule";

export const name: string = "help";
export const module: string = "Information";
export const aliases: string[] = ["хелп", "помощь"];
export const description: string =
  "Shows a list of commands or information about a command";
export const usage: string = "help [command]";
export const examples: Array<Example> = [
  {
    command: "help",
    description: "Shows all available commands",
  },
  {
    command: "help ping",
    description: "Shows information about `ping` command",
  },
  {
    command: "help Owner",
    description: "Shows information about `Owner` module",
  },
];
export const run: RunFunction = async (client, message, args) => {
  const GuildSettingsSchema: Database = await client.database.load("GuildSettings");
  const GuildSettings: Anything = await GuildSettingsSchema.findOne({
    GuildID: message.guild.id,
  });

  const Prefix = GuildSettings?.Prefix || defaultSettings.Prefix;
  if (!args.length) {
    const fields: Array<EmbedFieldData> = [...client.modules.keys()].map(
      (value: string) => {
        const module = client.modules.get(value);
        return {
          name: `${module.emoji} ${client.utils.upFirstLetter(value)} [${
            client.commands.filter(
              (command: Command) => command.module.toLowerCase() === value.toLowerCase(),
            ).size
          }]`,
          value: client.commands
            .filter(
              (command: Command) => command.module.toLowerCase() === value.toLowerCase(),
            )
            .map((command: Command) => `\`${command.name}\``)
            .join(", "),
        };
      },
    );
    const commandEmbed: MessageEmbed = new MessageEmbed({
      fields,
      description: `${emojis.Info} **Total \`${client.commands.size}\` Commands in \`${client.modules.size}\` Modules**`,
      footer: {
        text: `To see a detailed description of the command, use: ${Prefix}help [Command name] \nTo see a detailed description of the module, use: ${Prefix}help [Module name]`,
      },
      color: colors.Blue,
    });
    return message.channel.send(commandEmbed);
  }
  const module: Module =
    client.modules.get(args[0].toLowerCase()) ||
    client.modules
      .filter((module: Module) =>
        module.aliases
          ?.map((alias) => alias.toLowerCase())
          .includes(args[0].toLowerCase()),
      )
      .first();
  if (module) {
    const moduleCommands = client.commands.filter(
      (command: Command) => command.module.toLowerCase() === module.name.toLowerCase(),
    );
    let description: string = `
    **Name:** ${client.utils.upFirstLetter(module.name)}
    **Description:** ${module.description}
    **Commands count:** ${moduleCommands.size}`;
    if (module.aliases?.length) {
      description += `
      **Aliases:** \n┗ ${module.aliases.map((alias) => `\`${alias}\``).join(", ")}`;
    }
    description += `
    **Commands:** \n┗ ${moduleCommands
      .map((command: Command) => `\`${command.name}\``)
      .join(", ")}`;
    const embed = new MessageEmbed()
      .setAuthor(`Information about ${module.name} module`, module.emojiLink)
      .setColor(module.color)
      .setDescription(description);
    return message.channel.send(embed);
  }
  const command: Command =
    client.commands.get(args[0].toLowerCase()) ||
    client.commands.get(client.aliases.get(args[0].toLowerCase()));
  if (!command) {
    return message.channel.send(
      client.embedUtils.createErrorEmbed(`Command or module \`${args[0]}\` not found`),
    );
  }

  let description: string = `**Command name**: \`${Prefix}${command.name}\`
    **Module**: ${command.module}`;
  if (command.description) {
    description += `
    **Description**: ${command.description}`;
  }
  if (command.ownerOnly) {
    description += `
    __**Only owner**__: This command only for bot owners`;
  }
  if (command.aliases?.length) {
    description += `
    **Aliases**: \n┗ ${command.aliases
      .map((alias) => `\`${Prefix}${alias}\``)
      .join(", ")}`;
  }
  if (command.usage) {
    description += `
    **Usage**: \n┗ \`${Prefix}${command.usage}\``;
  }
  if (command.examples?.length) {
    description += "\n";
    command.examples.forEach((example, index) => {
      if (example.command !== "" && example.description !== "") {
        description += `
          **Example ${++index}:**
          \`${Prefix}${example.command}\`
          ┗ ${example.description}
        `;
      }
    });
  }
  return await message.channel.send(
    new MessageEmbed({
      author: {
        name: `Information about ${command.name} command`,
        iconURL: emojisLinks.Info,
      },
      description,
      footer: { text: "Syntax: <> = required, [] = optional, | - or, / - identical" },
      color: colors.Blue,
    }),
  );
};
