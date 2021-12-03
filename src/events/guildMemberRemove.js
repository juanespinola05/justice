const { getAllGiveaways } = require("../utils/dataManager");

module.exports = async (client, member) => {
  const { guild } = member;
  const giveaways = Object.entries(getAllGiveaways());
  const giveawaysToCheck = [];
  giveaways.forEach(([messageId, giveaway]) => {
    if (guild.id === giveaway) giveawaysToCheck.push(messageId);
  });
  for (const giveawayMessageId of giveawaysToCheck) {
    const giveaway = client.giveawaysManager.giveaways.find(
      (g) => g.messageId === giveawayMessageId
    );
    try {
      const giveawayChannel = await client.channels.fetch(giveaway.channelId);
      const giveawayMessage = await giveawayChannel.messages.fetch(
        giveawayMessageId
      );
      await giveawayMessage.reactions.resolve("🎉").users.remove(member.id);
      let msg = member.send(
        `Your entry to giveaway on ${guild.name} was removed because you left the server.`
      );
    } catch (e) {}
  }
};
