const path = require('path');
const fs = require('fs');
const { MessageEmbed, Message, MessageActionRow, MessageButton } = require('discord.js');
const TicketCategory = require('../proto/TicketCategory');
const Ticket = require('../proto/Ticket');


// -------------------------
//        Categories
// -------------------------
const createCategory = async function (interaction, options) {
    const container_embed = new MessageEmbed()
    .setTitle(options.title)
    .setColor(options.color ?? "#00FF00")
    .setDescription(options.desc)
    .setFooter(options.channel.guild.name, options.channel.guild.iconURL());
    
    const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setCustomId('create')
        .setLabel('Create')
        .setStyle('PRIMARY')
        .setEmoji('📩')
    );

    try {
        
        var container = await options.channel.send({
            embeds: [container_embed],
            components: [row]
        });
    
    } catch (e) {
        console.error(e);
        return interaction.reply({
            content: "An error ocurred while trying to send the container.",
            ephemeral: true
        });
    }

    options.container_id = container.id;
    options.channel_id = options.channel.id;
    
    const newCategory = new TicketCategory(options);
    this.categories.push(newCategory);

    fs.writeFile(path.join(__dirname + "../../data/ticketCategories.json"),
        JSON.stringify(this.categories, null, 4), 
        (err, _) => {
            if(err) {
            this.categories.splice(this.categories.indexOf(newCategory),1);
            console.error(err);
            return interaction.reply({
                content: 'An error ocurred while trying to save new category info.',
                ephemeral: true
            });
            }

            return interaction.reply({
            content: ':white_check_mark: Ticket category successfully created.',
            ephemeral: true
            });
        });

}

const getCategory = function (categoryTitle) {
    return this.categories.find(cat => {
        return cat.title === categoryTitle.toLowerCase()
    });
}

// -------------------------
//         Tickets
// -------------------------

const createTicket = async function (client, member, category) {
    const newTicket = new Ticket(member, category.title);
    newTicket.assignId(client);
    
    try {
        var categoryChannel = member.guild.channels.cache.find(c => {
            return c.type === "GUILD_CATEGORY" && c.name === category.title
        }) ?? await createChannel(member, category.title, "GUILD_CATEGORY", [], []);
    
        var channel = await createChannel(member, `${category.title}-${newTicket.ticket_id}`,
        "GUILD_TEXT",
        [{id: member.user.id, allow: ["VIEW_CHANNEL","SEND_MESSAGES"]}],
        categoryChannel
        );
    } catch (e) {
        console.error(e);
        newTicket.abortCreation(member);
        return delete newTicket;
    }
    
    newTicket.channel_id = channel.id;
    this.tickets.push(newTicket);

    fs.writeFile(path.join(__dirname, "..", "data", "tickets.json"), 
    JSON.stringify(this.tickets, null, 4),
    async (error, _ ) => {
        console.log(_);
        if(error) {
            await channel.delete();
            console.error(error);
            newTicket.abortCreation(member);
            return delete newTicket;
        }
        
        newTicket.welcomeMember(member, category.color, channel);
    
    });


}

const getTicket = function(id, cat) {
    return this.tickets.find((t) => {
        return t.user_id === id && t.category === cat
    });
}

async function createChannel(member, name, type, permissions, parent) {
    return new Promise(async (res, rej) => {
        try {

            let channelCreateOptions = {
                type: type,
                permissionOverwrites: [
                    {
                        id: member.guild.roles.everyone,
                        deny: ["VIEW_CHANNEL","SEND_MESSAGES"]
                    },
                    ...permissions]
            }
            if(parent) channelCreateOptions['parent'] = parent;

            let ch = await member.guild.channels.create(name, channelCreateOptions);
            res(ch);
            
        } catch (e) {
            rej(e); 
        }
    });
    
}

const buttons = function(client, interaction) {
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

async function checkDetailsToCreate(client, interaction) {
    const category = client.ticketManager.getCategory(interaction.channel.name.split("-")[0]);
    if(!category) return;

    const ticket = client.ticketManager.getTicket(interaction.user.id, category.title);
    
    if(ticket) {
        alreadyHasATicket = alreadyHasATicket
        .replace(/{category}/gmi, ticket.category)
        .replace(/{ticket_channel}/gmi, `<#${ticket.channel_id}>`);
        try {
            let alreadyHasTicketMsg = await interaction.member.send({
                content: alreadyHasATicket
            });
        } catch (e) {console.error(e);}
    } else {
        
        // Create ticket
        let ticketOptions = [
            client,
            interaction.member,
            category
        ];
        client.ticketManager.createTicket(ticketOptions);
    
    }
    return interaction.reply({
        content: "Done!",
        ephemeral: true
    });
}

async function checkDetailsToChangeState(client, interaction, state) {
    
    if(!interaction.member.roles.cache.has(ticketManagerRole) &&
        !interaction.member.permissions.has('ADMINISTRATOR')
    ) return;

    const ticket = client.ticketManager.tickets.find(t => t.channel_id === interaction.channel.id);
    if(!ticket) return;

    const ticketMember = await interaction.guild.members.fetch(ticket.user_id);
    
    const msg = await interaction.channel.messages.fetch(ticket.welcome_message_id);
    if(state === "close")  {
        
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('close')
            .setLabel('Close')
            .setDisabled(true)
            .setStyle('PRIMARY'),
            new MessageButton()
            .setCustomId('open')
            .setLabel('Open')
            .setDisabled(false)
            .setStyle('SUCCESS'),
            new MessageButton()
            .setCustomId('delete')
            .setLabel('Delete')
            .setDisabled(false)
            .setStyle('DANGER')
        );

        msg.edit({content: msg.content, embeds: msg.embeds, components: [row]})

        interaction.channel.permissionOverwrites.edit(ticketMember, {
            SEND_MESSAGES: false,
            VIEW_CHANNEL: false
        });
        
        return interaction.reply({
            content: ':lock: Ticket closed',
            ephemeral: true
        });

    } else if(state === "open") {
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

        msg.edit({content: msg.content, embeds: msg.embeds, components: [row]})

        if(ticketMember)
            interaction.channel.permissionOverwrites.edit(ticketMember, {
                SEND_MESSAGES: false,
                VIEW_CHANNEL: false
            });
        return interaction.reply({
            content: ':unlock: Ticket Opened',
            ephemeral: true
        });
    }
}


module.exports = [
    {name:"createCategory", run: createCategory},
    {name:"getCategory", run: getCategory},
    {name:"createTicket", run: createTicket}
];