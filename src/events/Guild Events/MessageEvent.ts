import { RunFunction } from "./../../interfaces/IEvent";
import { Message } from "discord.js";
import { Command } from "../../interfaces/ICommand";

export const name: string = "message";
export const run: RunFunction = async (client, message: Message) => {
	const prefix: string = ">";
	if (
		message.author.bot ||
		!message.guild ||
		!message.content.toLocaleLowerCase().startsWith(prefix)
	) {
		return;
	}
	const args: string[] = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const cmd: string = args.shift();
	const command: Command = client.commands.get(cmd);
	if (!command) {
		return;
	}
	command
		.run(client, message, args)
		.catch((reason: any) =>
			message.channel.send(
				client.embed({ description: `Error: ${reason}` }, message),
			),
		);
};
