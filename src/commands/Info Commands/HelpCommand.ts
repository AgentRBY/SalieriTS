import { Command, Example, RunFunction } from "./../../interfaces/ICommand";
import { EmbedFieldData, MessageEmbed, MessageEmbedFooter } from "discord.js";

export const name: string = "help";
export const category: string = "info";
export const aliases: string[] = ["хелп", "помощь"];
export const description: string =
  "Shows a list of commands or information about a command";
export const usage: string = "help [command]";
export const example: Array<Example> = [
  { command: "help", description: "Shows all available commands" },
  {
    command: "help ping",
    description: "Shows information about `ping` command",
  },
];
export const run: RunFunction = async (client, message, args) => {
  if (!args.length) {
    const fields: Array<EmbedFieldData> = [...client.categories].map(
      (value: string) => {
        return {
          name: `${value[0].toUpperCase() + value.slice(1).toLowerCase()} [${
            client.commands.filter(
              (command: Command) =>
                command.category.toLowerCase() === value.toLowerCase(),
            ).size
          }]`,
          value: client.commands
            .filter(
              (command: Command) =>
                command.category.toLowerCase() === value.toLowerCase(),
            )
            .map((command: Command) => `\`${command.name}\``)
            .join(", "),
        };
      },
    );
    const commandEmbed: MessageEmbed = new MessageEmbed({
      fields,
      description: `${client.commands.size} commands`,
      footer: {
        text: `To see a detailed description of the commands use ${client.config.prefix}help [Command name]`,
      },
      color: 3066993,
    });
    return await message.channel.send(commandEmbed);
  }
  const command: Command =
    client.commands.get(args[0]) ||
    client.commands.get(client.aliases.get(args[0]));
  if (!command) {
    return await message.channel.send(
      new MessageEmbed({
        description: `Command \`${args[0]}\` not found`,
        color: 3066993,
      }),
    );
  }

  let description: string = `**Command name**: \`${client.config.prefix}${
    command.name
  }\`
    **Category**: ${
      command.category[0].toUpperCase() +
      command.category.slice(1).toLowerCase()
    }`;
  if (command.description) {
    description += `
    **Description**: ${command.description}`;
  }
  if (command.aliases?.length) {
    description += `
    **Aliases**: \n┗ ${command.aliases
      .map((alias) => `\`${client.config.prefix}${alias}\``)
      .join(", ")}`;
  }
  if (command.usage) {
    description += `
    **Usage**: \n┗ \`${client.config.prefix}${command.usage}\``;
  }
  if (command.example?.length) {
    description += "\n";
    command.example.forEach((example, index) => {
      description += `
        **Example ${++index}:**
        \`${client.config.prefix}${example.command}\`
        ┗ ${example.description}
      `;
    });
  }
  return await message.channel.send(
    new MessageEmbed({
      title: `Information about \`${command.name}\` command`,
      description,
      footer: { text: "Syntax: <> = required, [] = optional" },
      color: 3066993,
    }),
  );
};
