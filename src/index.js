const fs = require("fs");
const {
  Client,
  Collection,
  Intents: { FLAGS: Intents },
} = require("discord.js");
const synchronizeSlashCommands = require("./discord-sync-commands");
const { GiveawaysManager } = require("discord-giveaways");
const TicketManager = require("./proto/ticketManager");

const client = new Client({
  intents: [
    Intents.GUILDS,
    Intents.GUILD_MEMBERS,
    Intents.GUILD_MESSAGE_REACTIONS,
    Intents.GUILD_MESSAGES
  ],
});

const config = require("../config.json");
const giveawayEvents = require("./utils/giveawayEvents");
client.config = config;

client.giveawaysManager = new GiveawaysManager(client, {
  storage: "./src/data/giveaways.json",
  default: {
    botsCanWin: false,
    embedColor: "#FF0000",
    reaction: "🎉",
    lastChance: {
      enabled: true,
      content: "⚠️ **LAST CHANCE TO ENTER !** ⚠️",
      threshold: 5000,
      embedColor: "#FF0000",
    },
  },
});

client.commands = new Collection();
fs.readdir("./src/commands/", (_err, files) => {
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    client.commands.set(commandName, {
      name: commandName,
      ...props,
    });
  });
  synchronizeSlashCommands(
    client,
    client.commands.map((c) => ({
      name: c.name,
      description: c.description,
      options: c.options,
      type: "CHAT_INPUT",
    })),
    {
      debug: !!config.debug,
      guildId: config.guildId,
    }
  );
});

fs.readdir("./src/events/", (_err, files) => {
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });
});

giveawayEvents(client);

// Tickets system

client.ticketManager = new TicketManager();
client.ticketManager._initManager();

client.login(config.token);
