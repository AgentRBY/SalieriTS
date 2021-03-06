import { RunFunction } from "./../../interfaces/ICommand";

export const name: string = "ready";
export const run: RunFunction = async (client) => {
	client.logger.success(`${client.user.tag} online`);
};
