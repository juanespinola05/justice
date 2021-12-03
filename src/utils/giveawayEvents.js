const { getGiveaway, deleteGiveaway } = require("./dataManager");

module.exports = (client) => {
  client.giveawaysManager.on(
    "giveawayReactionAdded",
    async (giveaway, member, reaction) => {
      const giveawayMessage = giveaway.messageId;
      const giveawaySettings = getGiveaway(giveawayMessage);
      const giveawayGuild = await client.guilds.fetch(giveawaySettings);
      let guildMember = null;
      try {
        guildMember = await giveawayGuild.members.fetch(member.id);
      } catch (e) {}
      if (!guildMember) {
        try {
          reaction.users.remove(member.user);
          let mgs = await member.send(
            `You must join ${giveawayGuild.name} server to enter this giveaway!`
          );
        } catch (e) {}
      }
    }
  );
  client.giveawaysManager.on("giveawayEnded", (giveaway, _) => {
    deleteGiveaway(giveaway.messageId);
  });
};
