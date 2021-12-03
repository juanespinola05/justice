module.exports = {
    description: "Create a ticket category",
  
    options: [
      {
        name: "title",
        description: "The title for this category",
        type: "STRING",
        required: true,
      },
      {
        name: "description",
        description: "The text shown in the category container",
        type: "STRING",
        required: true
      },
      {
        name: "channel",
        description: "Channel where users will create tickets for this category",
        type: "CHANNEL",
        required: true
      },
      {
        name: "color",
        description: "The color for the category embed message",
        type: "STRING",
        required: false
      }
    ],
  
    run: async (client, interaction) => {
        
        if(!interaction.member.roles.cache.has(client.config.ticketManagerRole) &&
            !interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({
                content: "You don't have enough permissions to create this.",
                ephemeral: true
            });
        }

        const title = interaction.options.getString("title").toLowerCase();
        const desc = interaction.options.getString("description");
        const ch = interaction.options.getChannel("channel");
        const color = interaction.options.getString("color");
        
        if(title.length > 15)
            return interaction.reply({
                content: 'Category names can be up to 15 characters long.',
                ephemeral: true
            });

        if(client.ticketManager.getCategory([title]))
            return interaction.reply({
                content: `The \`${title}\` category already exists.`,
                ephemeral: true
            });

        if(!ch.isText())
            return interaction.reply({
                content: `The ${ch} channel is not text-based`,
                ephemeral: true
            });


        if(!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/g.test(color) && color)
            return interaction.reply({
                content: `The color \`${color}\` is not a valid HEX code.`,
                ephemeral: true
            });

        client.ticketManager.createCategory([interaction, {
            title: title,
            desc: desc,
            channel: ch,
            color: color
        }]);

    },
  };
  