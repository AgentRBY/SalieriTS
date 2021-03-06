import { RunFunction } from "./../../interfaces/ICommand";
import { Message } from "discord.js";

export const name: string = "ping";
export const run: RunFunction = async (client, message) => {
	const msg: Message = await message.channel.send("Pinging...");
	msg.delete();
	await message.channel.send(
		client.embed(
			{
				description: `WebSocket: ${client.ws.ping}ms \nPing: ${
					msg.createdTimestamp - message.createdTimestamp
				}, `,
			},
			message,
		),
	);
};
