import { Module } from "./../interfaces/IModule";
import { colors, emojis, emojisLinks } from "./BotConfig";

export const Modules: Array<Module> = [
  {
    name: "Information",
    description:
      "The commands of this module show information about something (example: show your avatar)",
    emoji: emojis.Info,
    emojiLink: emojisLinks.Info,
    color: colors.Blue,
    aliases: ["Info"],
  },
  {
    name: "Economy",
    description: "Economy commands, such as money management, robbing, etc",
    emoji: emojis.Coin,
    emojiLink: emojisLinks.Coin,
    color: colors.LightYellow,
    aliases: ["Econ"],
  },
  {
    name: "Owner",
    description: "Commands intended for bot owners",
    emoji: emojis.Wrench,
    emojiLink: emojisLinks.Wrench,
    color: colors.LightRed,
  },
  {
    name: "Settings",
    description: "Bot settings for administration or users",
    emoji: emojis.Settings,
    emojiLink: emojisLinks.Settings,
    color: colors.Gray,
    aliases: ["Config"],
  },
];
