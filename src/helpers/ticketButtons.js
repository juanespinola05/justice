const { MessageActionRow, MessageButton } = require("discord.js")

module.exports = (options = [
    ["close", false],
    ["open", true],
    ["delete", true],
]) => {
    const buttons = [];
    options.forEach(element => {
        let name = options[buttons.length];
        buttons.push(new MessageButton()
        .setCustomId(options[buttons.length][0])
        .setLabel(options[buttons.length][1]))
    });
    const row = new MessageActionRow()
    .addComponents(...);
}