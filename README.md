<p align="center">
  <img src="assets/Coeus.png" width="150" title="Logo">
</p>
<h1 align="center">Coeus</h1>

An ambitious **Discord** bot to manage new users, build a player database, and answer questions.

The project is split into three main parts. First, the bot teaches new players, obtains their data, and whitelists new players. Second, the bot answers players' questions. Both parts are conducted over DMs but there are announcement messages in the server in a channel. Third, the bot updates a member count and checks for changed Minecraft usernames.

## ⚠️ BEWARE: CURRENTLY BEING REORGANIZED AND DOES NOT WORK ⚠️
## Feature list

- [x] **User log channel**
  - [x] User join
  - [x] User leave
  - [x] Member rejoin
  - [x] User -> Member
  - [x] Member leave
- [x] **Member count channel**
- [x] **New user DMs**
  - [x] Information on join
  - [x] Minecraft username lookup & check
  - [x] Loop through "flow" messages
- [ ] **User -> Member**
  - [x] Create & check for timestamps
  - [ ] Give user member role
  - [ ] Change nickname
  - [ ] Whitelist user
- [ ] **Question answering**
  - [ ] Help command
  - [ ] Browse command
  - [ ] Error response
- [ ] **Auto Minecraft username to nickname**
- [ ] **Ban preventions**

## Setup Requirements

1. On the first run, a configuration file called `config.json` will be created in the root folder with the index.js. You must fill it out.
 - *dynmap_api* is a link like https://map.darnoc-realms.ml/up/world/world/1612469985598

2. A .JSON file to hold the players data, another to hold the flow messages, and another to hold the answers to questions. Copy the full paths into the configuration.
3. A Discord bot and have a token, [guide here](https://gist.github.com/venashial/a47b975f53b3c1113615959be6392a2d)
4. Create "member count" & "ingame count" voice channels and a "user log" text channel. Copy their IDs into the configuration.
5. Create a "member" role and copy its ID into the configuration.
6. A Discord server. Invite the bot with this link but replace with the actual client ID found on the "General Information" tab on the Discord developer portal: `https://discord.com/oauth2/authorize?client_id=<<YOUR CLIENT ID HERE>>&permissions=8&scope=bot`

## Running the Bot

Run the command below to start the bot

```zsh
yarn run start
```

## Source Code

This project is licensed under the MIT license
