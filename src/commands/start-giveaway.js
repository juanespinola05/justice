const ms = require("ms");
const { saveGiveaway } = require("../utils/dataManager");
const messages = require("../utils/messages");

module.exports = {
  description: "Start a giveaway",

  options: [
    {
      name: "duration",
      description:
        "How long the giveaway should last for. Example values: 1m, 1h, 1d",
      type: "STRING",
      required: true,
    },
    {
      name: "winners",
      description: "How many winners the giveaway should have",
      type: "INTEGER",
      required: true,
    },
    {
      name: "prize",
      description: "What the prize of the giveaway should be",
      type: "STRING",
      required: true,
    },
    {
      name: "guild",
      description: "Which guild contestants should join",
      type: "STRING",
      required: true,
    },
    {
      name: "channel",
      description: "The channel to start the giveaway in",
      type: "CHANNEL",
      required: true,
    },
  ],

  run: async (client, interaction) => {
    if (!interaction.member.roles.cache.has(client.config.managerRole)) {
      return interaction.reply({
        content: "You need to have giveaway manager role to use this command.",
        ephemeral: true,
      });
    }

    const giveawayChannel = interaction.options.getChannel("channel");
    const giveawayDuration = interaction.options.getString("duration");
    const giveawayWinnerCount = interaction.options.getInteger("winners");
    const giveawayPrize = interaction.options.getString("prize");
    const giveawayGuild = interaction.options.getString("guild");

    const guild = client.guilds.cache.find(
      (g) => g.name === giveawayGuild || g.id === giveawayGuild
    );

    if (!giveawayChannel.isText()) {
      return interaction.reply({
        content: "Selected channel is not text-based.",
        ephemeral: true,
      });
    }

    if (!guild) {
      return interaction.reply({
        content: "Unable to find a guild for `" + giveawayGuild + "`.",
        ephemeral: true,
      });
    }

    const giveaway = await client.giveawaysManager.start(giveawayChannel, {
      duration: ms(giveawayDuration),
      prize: giveawayPrize,
      winnerCount: giveawayWinnerCount,
      hostedBy: client.config.hostedBy ? interaction.user : null,
      messages,
    });

    saveGiveaway(guild.id, giveaway.messageId);

    interaction.reply(`Giveaway started in ${giveawayChannel}!`);
  },
};
