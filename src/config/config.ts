import logger from "helpers/logger";

export interface ISubscription {
  discordChannelId: string;
  type: "NFTSale";
  mintAddress: string;
}

interface ITwitterConfig {
  appKey: string;
  appSecret: string;
  accessToken: string;
  accessSecret: string;
}

export interface IConfig {
  discordBotToken: string;
  queueConcurrency: number;
  subscriptions: ISubscription[];
  status: "initializing" | "watching" | "stopped";
  health: "OK" | "ERROR";
}

export type Status = "initializing" | "watching" | "stopped";

export type Health = "OK" | "ERROR";

export class Config implements IConfig {
  discordBotToken: string;
  queueConcurrency: number;
  subscriptions: ISubscription[];
  status: Status;
  health: Health;

  constructor(
    discordBotToken: string,
    queueConcurrency: number,
    subscriptions: ISubscription[],
    status: Status,
    health: Health
  ) {
    this.discordBotToken = discordBotToken;
    this.queueConcurrency = queueConcurrency;
    this.subscriptions = subscriptions;
    this.status = status;
    this.health = health;
  }

  async setSubscriptions(subscriptions: ISubscription[]): Promise<void> {
    this.subscriptions = subscriptions;
  }

  async addSubscription(subscription: ISubscription): Promise<void> {
    this.subscriptions.push(subscription);
  }

  setStatusWatching() {
    this.status = "watching";
  }
}

export type Env = { [key: string]: string };

export interface MutableConfig extends IConfig {
  setSubscriptions(subscriptions: ISubscription[]): Promise<void>;

  addSubscription(subscription: ISubscription): Promise<void>;

  setStatusWatching(): void;
}

function loadSubscriptions(env: Env): ISubscription[] {
  if (!env.SUBSCRIPTION_MINT_ADDRESS || !env.SUBSCRIPTION_DISCORD_CHANNEL_ID) {
    return [];
  }
  const addresses = env.SUBSCRIPTION_MINT_ADDRESS.split(",");
  const discordChannels = env.SUBSCRIPTION_DISCORD_CHANNEL_ID.split(",");
  if (
    discordChannels.length != addresses.length &&
    discordChannels.length !== 1
  ) {
    logger.error(
      `Invalid number of discord channel ids: ${discordChannels.length}`
    );
    return [];
  }

  const subscriptions: ISubscription[] = [];

  addresses.forEach((address, idx) => {
    if (!address) {
      return;
    }
    const channel = discordChannels[idx] || discordChannels[0];
    if (!channel) {
      return;
    }

    subscriptions.push({
      type: "NFTSale",
      discordChannelId: channel,
      mintAddress: address,
    });
  });

  return subscriptions;
}

export function loadConfig(env: Env): MutableConfig {
  return new Config(
    env.DISCORD_BOT_TOKEN || "",
    parseInt(env.QUEUE_CONCURRENCY || "2", 10),
    loadSubscriptions(env),
    "initializing",
    "OK"
  );
}
