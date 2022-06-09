# NFT Sales Discord Bot

This is part of a personal project to build tools for Solana DAO's.

## Running using docker

### Requirement
* [Docker](https://www.docker.com/products/docker-desktop) (to run with docker).
* A Solana RPC node/server - This is needed so the bot know where to call to fetch solana transactions.

### Instructions

#### Run bot locally using docker in the terminal

##### Running with docker

```
docker run --name nftbot -d -p 4000:4000 -e SOLANA_RPC=YOURRPCURL -e DISCORD_BOT_TOKEN=YOURDISCORDTOKEN -e SUBSCRIPTION_DISCORD_CHANNEL_ID=YOURCHANNELID -e SUBSCRIPTION_MINT_ADDRESS=YOURMINTADDRESS milktoastlab/solananftbot
```

##### Running locally

Set the env variables at `.env` file and follow the next steps:

- yarn install
- yarn build;
- yarn start.

Alternatively, you can run it using docker-compose:

Update `.env` with your secret and run
```
docker-compose up -d bot
```


To make sure the bot is working properly, use [/tx/details](src/routes/index.ts#L22) endpoint
```
curl "http://localhost:4000/tx/details?signature={sale_transaction_signature}&channelId={discord_channel_id}"
```

In case of *DiscordAPIError: Missing Access* error, check if the bot has been invited to the channel. Go to the channel, click "Add members or roles" and add your bot account as a member.


Alternatively, you can run it using docker-compose:

Update `.env` with your secret and run
```
docker-compose up -d bot
```

See [here](#configurable-environments) for more details on environment variables

View logs
```
docker-compose logs bot
```

## Running in development
### Requirement
* Node >= 16.6
* Yarn

### Instructions

#### 1. Install dependencies
```
yarn install
```

#### 2. Update .env with your secrets

Follow the instructions [here](#configurable-environments)

#### 3. Run the server
```
yarn dev
```

## Configurable environments

Here are a list of environments you need to configure before running the NFT bot.

```sh
# RPC node url
SOLANA_RPC=
# Discord bot secret
DISCORD_BOT_TOKEN=
# The discord channel to notify
SUBSCRIPTION_DISCORD_CHANNEL_ID=
# Mint address to watch for sales
SUBSCRIPTION_MINT_ADDRESS=
# Twitter secrets
TWITTER_API_KEY=
TWITTER_API_KEY_SECRET=
TWITTER_ACCESS_TOKEN=
TWITTER_ACCESS_TOKEN_SECRET=
```
https://github.com/milktoastlab/SolanaNFTBot/blob/main/.env

### Variable breakdowns

#### DISCORD_BOT_TOKEN
This is your discord bot secret.
If you don't have a discord bot yet, you can create one following the instructions here:
https://discordpy.readthedocs.io/en/stable/discord.html

Make sure your bot has the required permissions:
* View channels
* Read/Send messages
* Send messages
* Embed links

<img width="827" alt="Screen Shot 2021-10-31 at 9 25 31 am" src="https://user-images.githubusercontent.com/90617759/139560537-e0420217-25d7-4538-81cc-d53422c24db9.png">

#### SUBSCRIPTION_DISCORD_CHANNEL_ID
This is the ID of the discord channel you want to send notifications to.
You will need to enable developer mode have access the channel IDs.
Here are the instructions:
https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-

#### SUBSCRIPTION_MINT_ADDRESS
This is the address that you want the Solana NFT bot to watch for notifications.
It needs to be one of the creator addresses:
<img width="324" alt="Screen Shot 2021-11-12 at 6 16 31 pm" src="https://user-images.githubusercontent.com/90617759/141426468-fcf7c522-4480-4a4e-b1e9-c0cbed3f4f10.png">

##### Watch multiple addresses
You can watch multiple addresses at once by using a comma between addresses:
```bash
SUBSCRIPTION_MINT_ADDRESS=add123,add1235
```
This feature reduces the need to run multiple containers in production.

## Marketplace support

- [x] [Magic Eden](https://magiceden.io/)
- [x] [Solanart](http://solanart.io/)
- [x] [Digital Eyes](https://digitaleyes.market/)
- [x] [Alpha Art](https://alpha.art/)
- [x] [Exchange Art](https://exchange.art/)
- [x] [Solsea](https://solsea.io/)
- [x] [OpenSea](https://opensea.io/)

#### 1. Add a new marketplace config
Use `src/helpers/marketplaces/solsea.ts` as example

#### 2. Write a test for the marketplace
Use `src/helpers/marketplaces/solsea.test.ts` as example

#### 3. Add the new marketplace to the existing list 
`src/helpers/marketplaces/marketplaces.ts`

