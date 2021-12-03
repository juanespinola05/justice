let { alreadyHasATicket } = require('../utils/ticketMessages');
const { ticketManagerRole } = require('../../config.json');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = async (client, interaction) => {
    
    if (interaction.isCommand()) {

        const command = client.commands.get(interaction.commandName);
        
        if (!command) return interaction.reply({
            content: `Command \`${interaction.commandName}\` not found.`,
            ephemeral: true
        });
        
        command.run(client, interaction);
    } else if(interaction.isButton()) {
        if(interaction.user.bot) return;
        
        switch(interaction.customId) {
            case "create":
                checkDetailsToCreate(client, interaction);
                break;
            case "close":
                checkDetailsToChangeState(client, interaction, "close");
                break;
            case "open":
                checkDetailsToChangeState(client, interaction, "open");
                break;
        }
        return;
    }
}
