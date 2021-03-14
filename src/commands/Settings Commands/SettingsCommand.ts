import { Example, RunFunction } from "./../../interfaces/ICommand";
import { MessageEmbed, PermissionString } from "discord.js";
import { settings } from "./../../static/Settings";
import { colors, emojisLinks } from "../../static/BotConfig";
import { Database } from "../../database/Database";
import { Anything } from "./../../interfaces/IAnything";
import { Setting } from "./../../interfaces/ISettings";

export const name: string = "settings";
export const category: string = "settings";
export const aliases: string[] = ["config", "options"];
export const description: string = "Allows you to configure the bot";
export const usage: string = "settings <parameter> <value | default/delete>";
export const examples: Array<Example> = [
  {
    command: "settings prefix .",
    description: "Sets the prefix to `.`",
  },
  {
    command: "settings prefix delete",
    description: "Sets the prefix to default(`>`)",
  },
];
export const memberPermissions: Array<PermissionString> = ["ADMINISTRATOR"];
export const run: RunFunction = async (client, message, args) => {
  const GuildSettingsSchema: Database = await client.database.load("GuildSettings");
  const GuildSettings: Anything = await GuildSettingsSchema.findOne({
    GuildID: message.guild.id,
  });
  if (!args[0]) {
    const embed: MessageEmbed = new MessageEmbed();
    for (const setting of settings) {
      embed.addField(
        setting.name,
        `**Parameter:** ${setting.parameter}
        **Description:** ${setting.description}
        **Default:** \`${setting.default}\`
        **Current value:** \`${setting.current(GuildSettings)}\``,
        true,
      );
    }
    embed.setColor(colors.Gray);
    embed.setDescription("List of bot settings");
    embed.setAuthor("Bot settings", emojisLinks.Setings);
    return message.channel.send(embed);
  }
  const setting: Setting = settings.find(
    (value: Setting) => value.parameter.toLowerCase() === args[0].toLowerCase(),
  );
  if (!setting) {
    return message.channel.send(
      client.embedUtils.createErrorEmbed("Parameter not found."),
    );
  }
  if (!args.slice(1).length) {
    return message.channel.send(
      client.embedUtils.createErrorEmbed("You did not enter a value for the parameter"),
    );
  }
  if (args[1].toLowerCase() === "delete" || args[1].toLowerCase() === "default") {
    await GuildSettingsSchema.update(
      { GuildID: message.guild.id },
      client.utils.getSingeObject(setting.parameter, undefined),
    );
    return message.channel.send(
      client.embedUtils.createSettingsEmbed(
        `Parameter \`${setting.parameter}\` set to default (\`${setting.default}\`)`,
      ),
    );
  }
  const validated = setting.validate(client, message, args.slice(1));
  if (validated.success === false) {
    return message.channel.send(client.embedUtils.createErrorEmbed(validated.fix));
  }
  await GuildSettingsSchema.update(
    { GuildID: message.guild.id },
    client.utils.getSingeObject(
      setting.parameter,
      setting.value(client, message, args.slice(1)),
    ),
  );
  return message.channel.send(
    client.embedUtils.createSettingsEmbed(
      `Parameter \`${setting.parameter}\` set to \`${setting.value(
        client,
        message,
        args.slice(1),
      )}\``,
    ),
  );
};
