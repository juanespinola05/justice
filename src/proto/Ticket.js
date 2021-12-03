const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { errorDMMessage, welcomeMessage } = require('../utils/ticketMessages');

class Ticket {
    constructor(member, category) {
        this.user_id = member.user.id;
        this.category = category;
        this.ticket_id = "";
        this.closed = false;
        this.channel_id;
        this.welcome_message_id;
    }

    assignId(client) {
        let id = generateId();
        if(client.ticketManager.tickets.find(t => t.ticket_id === id))
            this.assignId(client);
        else this.ticket_id = id;
    }
    
    async abortCreation(member) {
        try {
            let alert = await member.send(errorDMMessage);
        } catch (_) {}
    }
    
    async welcomeMember(member, color, channel) {
        let user = member.user;
        const welcome_embed = new MessageEmbed()
        .setTitle(`${member.user.username}'s ${this.category} ticket`)
        .setColor(color)
        .addFields([
            {
                name: "Ticket ID",
                value: this.ticket_id,
                inline: true
            },
            {
                name: "Closed",
                value: "False"  ,
                inline: true
            },
            {
                name: "Created At",
                value: new Date().toLocaleDateString('en-US','DD-MM-YYYY hh:mm'),
            },
        ])
        .setThumbnail(user.displayAvatarURL());
        
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('close')
            .setLabel('Close')
            .setDisabled(false)
            .setStyle('PRIMARY'),
            new MessageButton()
            .setCustomId('open')
            .setLabel('Open')
            .setDisabled(true)
            .setStyle('SUCCESS'),
            new MessageButton()
            .setCustomId('delete')
            .setLabel('Delete')
            .setDisabled(true)
            .setStyle('DANGER')
        );


        try {
            let welcome = await channel.send({
                content: welcomeMessage.replace(/{member}/gmi, `<@${user.id}>`),
                embeds: [welcome_embed],
                components: [row]
            });
        } catch (_) {}
    }
}

function generateId() {
    let id = "";
    for(let i = 0; i < 4; i++) {
        id += Math.floor(Math.random() * 10);
    }
    return id;
}

module.exports = Ticket;