import EventEmitter from "events";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Events = Record<string, (...args: any) => any>;

interface GenericEventEmitter<TEvents extends Events> {
  on<TEv extends keyof TEvents>(event: TEv, listener: TEvents[TEv]): this;
  off<TEv extends keyof TEvents>(event: TEv, listener: TEvents[TEv]): this;
  once<TEv extends keyof TEvents>(event: TEv, listener: TEvents[TEv]): this;
  emit<TEv extends keyof TEvents>(event: TEv, ...args: Parameters<TEvents[TEv]>): boolean;
}

/**
 * Create a type-safe event emitter
 * Generics passed in have to be declared as `type`. `interface` won't work.
 */
export const createEventEmitter = <T extends Events>() => {
  return new EventEmitter() as GenericEventEmitter<T>;
};
