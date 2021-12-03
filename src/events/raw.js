let { alreadyHasATicket } = require('../utils/ticketMessages');

module.exports = async (client, packet) => {
    
    // if(packet.t === "MESSAGE_REACTION_ADD") {
        
    //     if(packet.d.member.user.bot) return;
        
    //     const category = client.ticketManager.categories.find(c => c.container_id === packet.d.message_id);
    //     if(!category) return;

        
    //     let channel = client.channels.cache.get(packet.d.channel_id),
    //     message = await channel.messages.fetch(packet.d.message_id);
        
    //     const ticket = client.ticketManager.tickets.find((t) => {
    //         return t.user_id === packet.d.user_id && t.category === category.title
    //     });

    //     if(ticket) {
    //         let member = channel.guild.members.cache.get(packet.d.user_id);
    //         alreadyHasATicket = alreadyHasATicket
    //         .replace(/{category}/gmi, ticket.category)
    //         .replace(/{ticket_channel}/gmi, `<#${ticket.channel_id}>`);
    //         try {
    //             let alreadyHasTicketMsg = await member.send({
    //                 content: alreadyHasATicket
    //             });
    //         } catch (e) {console.error(e);}
    //     } else {
            
    //         // Create ticket
    //         packet.d.member.guild_id = packet.d.guild_id;
    //         let ticketOptions = [
    //             client,
    //             packet.d.member,
    //             category
    //         ];
    //         client.ticketManager.createTicket(ticketOptions);
        
    //     }


    //     return message.reactions.resolve("📩").users.remove(packet.d.user_id);
    // }
}