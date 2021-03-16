import { Example, RunFunction } from "./../../interfaces/ICommand";
import { PermissionString } from "discord.js";
import cmd from "node-cmd";

export const name: string = "console";
export const module: string = "Owner";
export const aliases: string[] = ["cmd"];
export const description: string = "Evaluate console command";
export const usage: string = "console <console command>";
export const ownerOnly: boolean = true;
export const run: RunFunction = async (client, message, args) => {
  if (!args[0]) {
    return message.channel.send(
      client.embedUtils.createErrorEmbed("Please provide some console command"),
    );
  }
  const command = args.join(" ");
  cmd.run(command, (error: string, data: string) => {
    console.log(data);
    if (error) {
      return message.channel.send(client.embedUtils.createErrorEmbed(error));
    }
    return message.channel.send(client.embedUtils.createSuccessEmbed(data));
  });
};
