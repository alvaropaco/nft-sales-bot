import express from "express";
import dotenv from "dotenv";
import { Env, loadConfig } from "config";
import logger from "helpers/logger";
import App from "./app";
import routes from "./routes";
import { newConnection } from "./helpers/solana/connection";

const _init = async () => {
  try {
    const result = dotenv.config();
    if (result.error) {
      throw result.error;
    }

    const config = loadConfig(process.env as Env);

    const server = express();

    const web3Conn = newConnection();

    routes(config, logger, server, web3Conn);

    await App({ config, logger, server, web3Conn });

    const host = process.env.HOST || "localhost";
    const port = process.env.PORT || 4000;
    server.listen(+port, host, (err?: any) => {
      if (err) throw err;
      config.setStatusWatching();
      logger.log(`${config.status} on http://${host}:${port}`);
    });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

_init();
