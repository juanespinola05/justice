module.exports = {
    description: "Create a ticket category",
  
    options: [
      {
        name: "ticket",
        description: "Ticket to close",
        type: "CHANNEL",
        required: true
      }
    ],
  
    run: async (client, interaction) => {
        
        if(!interaction.member.roles.cache.has(client.config.ticketManagerRole) &&
            !interaction.member.permissions.has('ADMINISTRATOR'))
            return interaction.reply({
                content: "You don't have enough permissions to do create this.",
                ephemeral: true
            });

        const ticketChannel = interaction.options.getChannel("ticket");
        const ticket = client.ticketManager.tickets.find(t => t.channel_id === ticketChannel.id);

        if(!ticket)
            return interaction.reply({
                content: 'Channel selected is not a ticket',
                ephemeral: true
            });
        
        if(ticket.closed)
            return interaction.reply({
                content: 'This ticket has already been closed',
                ephemeral: true
            });


        try {
            await ticketChannel.guild.members.permissionOverwrites.edit(ticket.user_id, {
                SEND_MESSAGES: false,
                VIEW_CHANNEL: false
            });
        } catch (e) {
            return interaction.reply({
                content: "Couldn't close ticket.",
                ephemeral: true
            })
        }
        
        ticket.closed = true;

        return interaction.reply({
            content: `:white_check_mark: ${ticketChannel.toString()}`,
            ephemeral: true
        });
    },
  };
  