import {newNotifierFactory, NotificationType} from "./notifier";
import {loadConfig} from "config";
import notifyDiscordSale from 'helpers/discord/notifyDiscordSale';
import queue from "queue";
jest.mock('helpers/discord');

jest.mock("helpers/discord/notifyDiscordSale", () => {
  return jest.fn();
});

describe("notifier", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const nQueue = queue({
    autostart: true,
  })

  it("notify with discord client", async () => {
    const factory = await newNotifierFactory({
      ...(loadConfig({})),
      discordBotToken: 'test-token-1',
    }, nQueue);

    const notifier = await factory.create({
      mintAddress: 'add-xxaa-12',
      discordChannelId: 'test',
    });
    await notifier.notify(NotificationType.Sale, {});

    expect(notifyDiscordSale).toHaveBeenCalledTimes(1);
  });

  it("notify with twitter client", async () => {
    jest.unmock('helpers/discord');
    const factory = await newNotifierFactory({
      ...(loadConfig({})),
      twitter: {
        appKey: 'app-x',
        appSecret: 'app-secret-1',
        accessSecret: 'xx-1',
        accessToken: 'token',
      },
    }, nQueue);

    const notifier = await factory.create({
      mintAddress: 'add-xxaa-12',
      discordChannelId: 'test',
    });
    await notifier.notify(NotificationType.Sale, {});

    expect(notifyDiscordSale).toHaveBeenCalledTimes(0);
  });
});
