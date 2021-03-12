import consola, { Consola } from "consola";
import {
  Client,
  MessageEmbed,
  MessageEmbedOptions,
  Message,
  Intents,
  Collection,
} from "discord.js";
import mongoose from "mongoose";
import glob from "glob";
import { Command } from "../interfaces/ICommand";
import { Event } from "../interfaces/IEvent";
import { promisify } from "util";
import { Config } from "./../interfaces/IConfig";
import { Schema } from "./../interfaces/ISchema";
import { DatabaseManager } from "../database/Database";
import { EventEmitter } from "events";
const globPromise = promisify(glob);

class Bot extends Client {
  public logger: Consola = consola;
  public commands: Collection<string, Command> = new Collection();
  public aliases: Collection<string, string> = new Collection();
  public categories: Set<string> = new Set();
  public events: Collection<string, Event> = new Collection();
  public config: Config;
  public schemas: Collection<string, Schema> = new Collection();
  public database: DatabaseManager;
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
    this.database = new DatabaseManager(this);
    // load database

    mongoose
      .connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .catch((e) => this.logger.error(e));

    //commands load
    const commandFiles: string[] = await globPromise(
      `${__dirname}/../commands/**/*{.ts, .js}`,
    );
    commandFiles.map(async (commandFile: string) => {
      const file: Command = await import(commandFile);
      this.commands.set(file.name, file);
      this.categories.add(file.category);
      if (file.aliases?.length) {
        file.aliases.map((alias) => this.aliases.set(alias, file.name));
      }
    });
    // events load
    const eventFiles: string[] = await globPromise(
      `${__dirname}/../events/**/*{.ts, .js}`,
    );
    eventFiles.map(async (eventFile: string) => {
      const event: Event = await import(eventFile);
      if (event.emitter && typeof event.emitter == "function") {
        event.emitter(this).on(event.name, event.run.bind(null, this));
      } else if (event.emitter && event.emitter instanceof EventEmitter) {
        (event.emitter as EventEmitter).on(
          event.name,
          event.run.bind(null, this),
        );
      } else {
        this.on(event.name, event.run.bind(null, this));
      }
    });
    // database(schemas) load
    const modelFiles: string[] = await globPromise(
      `${__dirname}/../database/models/**/*{.ts, .js}`,
    );
    modelFiles.map(async (schemaFile: string) => {
      const schema: Schema = await import(schemaFile);
      this.schemas.set(schema.name, schema);
    });

    this.login(config.token);
  }
  public embed(options: MessageEmbedOptions, message: Message): MessageEmbed {
    return new MessageEmbed({ ...options, color: 3066993 });
  }
}

export { Bot };
