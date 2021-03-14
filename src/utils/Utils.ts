import { Bot } from "../client/Client";
import { MessageEmbed } from "discord.js";
import { colors, emojis } from "./../static/BotConfig";

class Utils {
  private client: Bot;
  constructor(client: Bot) {
    this.client = client;
    this.client.logger.info("Utils has been constructed");
  }

  public createSuccessEmbed(description: String): MessageEmbed {
    return new MessageEmbed().setDescription(`${emojis.Yes} ${description}`).setColor(colors.Green);
  }
  public createErrorEmbed(description: String): MessageEmbed {
    return new MessageEmbed().setDescription(`${emojis.No} ${description}`).setColor(colors.Red);
  }
}

export { Utils };
