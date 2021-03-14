import { Setting } from "../interfaces/ISettings";
import { defaultSettings } from "./BotConfig";
import { Anything } from "./../interfaces/IAnything";

export const settings: Array<Setting> = [
  {
    name: "Change prefix",
    parameter: "Prefix",
    description: "Change the prefix of the bot",
    validate: (client, message, args) => {
      const value: boolean = args[0].length < 3;
      return {
        value,
        fix: "Prefix length is less then 3!",
        success: value != false,
      };
    },
    value: (client, message, args) => args[0],
    default: defaultSettings.Prefix,
    current: (GuildSettings: Anything) => GuildSettings?.Prefix || defaultSettings.Prefix,
  },
];
