import { Express } from "express";
import queue from "queue";
import { Connection } from "@solana/web3.js";
import initWorkers from "workers/initWorkers";
import { Worker } from "workers/types";
import notifyNFTSalesWorker from "workers/notifyNFTSalesWorker";
import { newNotifierFactory } from "helpers/notifier";
import Logger from "helpers/logger/type";
import { Config } from "config";

type AppOpts = {
  config: Config
  logger: Logger
  server: Express
  web3Conn: Connection
}

const App = async (opts: AppOpts) => {
  const { config, config: { subscriptions }, logger, server, web3Conn } = opts;
  try {
    const nQueue = queue({
      concurrency: config.queueConcurrency,
      autostart: true,
    });

    const notifierFactory = await newNotifierFactory(config, nQueue);

    if (!subscriptions.length) {
      logger.warn('No subscriptions');
      return;
    }

    const workers: Worker[] = subscriptions.map((s) => {
      const project = {
        discordChannelId: s.discordChannelId,
        mintAddress: s.mintAddress,
      };
      const notifier = notifierFactory.create(project);
      // Core feature. Here is where we are notifying the channel
      return notifyNFTSalesWorker(notifier, web3Conn, project);
    });

    const _ = initWorkers(workers, () => {
      // Add randomness between worker executions so the requests are not made all at once
      return Math.random() * 5000; // 0-5s
    });
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
};

export default App;
