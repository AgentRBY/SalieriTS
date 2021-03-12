import { Bot } from "../client/Client";
import { EventEmitter } from "events";
export interface RunFunction {
  (client: Bot, ...args: unknown[]): Promise<unknown>;
}

export interface FunctionForEE {
  (client: Bot): EventEmitter;
}
export interface Event {
  name: string;
  run: RunFunction;
  emitter?: EventEmitter | FunctionForEE;
}
