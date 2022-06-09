import { Express } from "express";
import { ParsedConfirmedTransaction, Connection } from "@solana/web3.js";
import { parseNFTSale } from "helpers/marketplaces";
import {
  initClient as initDiscordClient,
} from "helpers/discord";
import notifyDiscordSale, { getStatus } from "helpers/discord/notifyDiscordSale";
import { Config } from '../config';
import Logger from "helpers/logger/type";

export default (config: Config, logger: Logger, server: Express, web3Conn: Connection) => {
  server.get("/", (req, res) => {
    const { status, health } = config;
    res.send({ status, health, ...getStatus() });
  });

  server.get("/health", (req, res) => {
    const { health } = config;
    res.send({ health });
  });

  server.get("/tx/details", async (req, res) => {
    const signature = (req.query["signature"] as string) || "";
    if (!signature) {
      res.send(`no signature in query param`);
      return;
    }

    let tx: ParsedConfirmedTransaction | null = null;
    try {
      tx = await web3Conn.getParsedConfirmedTransaction(signature);
    } catch (e) {
      logger.log(e);
      res.send(`Get transaction failed, check logs for error.`);
      return;
    }
    if (!tx) {
      res.send(`No transaction found for ${signature}`);
      return;
    }
    const nftSale = await parseNFTSale(web3Conn, tx);
    if (!nftSale) {
      res.send(
        `No NFT Sale detected for tx: ${signature}\n${JSON.stringify(tx)}`
      );
      return;
    }
    if (config.discordBotToken) {
      const discordClient = await initDiscordClient(config.discordBotToken);
      if (discordClient) {
        const channelId = (req.query["channelId"] as string) || "";
        await notifyDiscordSale(discordClient, channelId, nftSale);
      }
    }

    return res.send(nftSale);
  });
};
