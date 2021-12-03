module.exports = {
  description: "Reroll a giveaway",

  options: [
    {
      name: "giveaway",
      description: "The giveaway to reroll (message ID or prize)",
      type: "STRING",
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

    const query = interaction.options.getString("giveaway");

    const giveaway =
      client.giveawaysManager.giveaways.find(
        (g) => g.prize === query && g.guildId === interaction.guild.id
      ) ||
      client.giveawaysManager.giveaways.find(
        (g) => g.messageId === query && g.guildId === interaction.guild.id
      );

    if (!giveaway) {
      return interaction.reply({
        content: "Unable to find a giveaway for `" + query + "`.",
        ephemeral: true,
      });
    }

    if (!giveaway.ended) {
      return interaction.reply({
        content: "The giveaway hasn't ended yet.",
        ephemeral: true,
      });
    }

    client.giveawaysManager
      .reroll(giveaway.messageId)
      .then(() => {
        interaction.reply("Giveaway rerolled!");
      })
      .catch((e) => {
        console.error(e);
        interaction.reply({
          content: "An error occured.",
          ephemeral: true,
        });
      });
  },
};
