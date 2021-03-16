import { Bot } from "../client/Client";
import { MessageEmbed, Snowflake } from "discord.js";
import { colors, emojis } from "./../static/BotConfig";

class Utils {
  private client: Bot;
  constructor(client: Bot) {
    this.client = client;
    this.client.logger.info("Utils has been constructed");
  }

  public validateBoolean(value: string): boolean | undefined {
    if (/^(?:y|yes|true|t|1|on|enable)$/i.test(value)) {
      return true;
    }

    if (/^(?:n|no|false|f|0|off|disable)$/i.test(value)) {
      return false;
    }

    return undefined;
  }
  public getSingeObject(key: string, value: any): Object {
    const object = {};
    object[key] = value;
    return object;
  }
  public upFirstLetter(text: string): string {
    return text[0].toUpperCase() + text.slice(1);
  }
}

class EmbedUtils {
  private client: Bot;
  constructor(client: Bot) {
    this.client = client;
    this.client.logger.info("Embed Utils has been constructed");
  }

  public createSuccessEmbed(description: String): MessageEmbed {
    return new MessageEmbed()
      .setDescription(`${emojis.Yes}  ${description}`)
      .setColor(colors.Green);
  }
  public createErrorEmbed(description: String): MessageEmbed {
    return new MessageEmbed()
      .setDescription(`${emojis.No}  ${description}`)
      .setColor(colors.Red);
  }
  public createSettingsEmbed(description: String): MessageEmbed {
    return new MessageEmbed()
      .setDescription(`${emojis.Settings}  ${description}`)
      .setColor(colors.Gray);
  }
}

class UserUtils {
  private client: Bot;
  constructor(client: Bot) {
    this.client = client;
    this.client.logger.info("Embed Utils has been constructed");
  }

  public getUserById(id: Snowflake) {
    return this.client.users.cache.get(id);
  }
}

export { EmbedUtils, Utils };
