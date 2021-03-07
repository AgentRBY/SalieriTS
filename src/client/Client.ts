import consola, { Consola } from "consola";
import {
  Client,
  MessageEmbed,
  MessageEmbedOptions,
  Message,
  Intents,
  Collection,
} from "discord.js";
import glob from "glob";
import { Command } from "../interfaces/ICommand";
import { Event } from "../interfaces/IEvent";
import { promisify } from "util";
import { Config } from "./../interfaces/IConfig";

const globPromise = promisify(glob);

class Bot extends Client {
  public logger: Consola = consola;
  public commands: Collection<string, Command> = new Collection();
  public aliases: Collection<string, string> = new Collection();
  public categories: Set<string> = new Set();
  public events: Collection<string, Event> = new Collection();
  public config: Config;

  public constructor() {
    super({
      ws: { intents: Intents.ALL },
      messageCacheLifetime: 180,
      messageCacheMaxSize: 200,
      messageSweepInterval: 180,
      messageEditHistoryMaxSize: 200,
      partials: ["MESSAGE", "GUILD_MEMBER", "CHANNEL", "REACTION", "USER"],
    });
  }
  public async start(config: Config): Promise<void> {
    this.config = config;
    this.login(config.token);
    const commandFiles: string[] = await globPromise(
      `${__dirname}/../commands/**/*{.ts, .js}`,
    );
    commandFiles.map(async (value: string) => {
      const file: Command = await import(value);
      this.commands.set(file.name, file);
      this.categories.add(file.category);
      if (file.aliases?.length) {
        file.aliases.map((value) => this.aliases.set(value, file.name));
      }
    });
    const eventFiles: string[] = await globPromise(
      `${__dirname}/../events/**/*{.ts, .js}`,
    );
    eventFiles.map(async (value: string) => {
      const file: Event = await import(value);
      this.events.set(file.name, file);
      this.on(file.name, file.run.bind(null, this));
    });
  }
  public embed(options: MessageEmbedOptions, message: Message): MessageEmbed {
    return new MessageEmbed({ ...options, color: 3066993 });
  }
}

export { Bot };
