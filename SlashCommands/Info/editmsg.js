const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require("@discordjs/builders")
const { ApplicationCommandOptionType, ButtonStyle } = require("discord.js")
const { PermissionFlagsBits } = require('discord-api-types/v10');

module.exports = {
  name: "editmsg",
  description: "edit message sent by bot",
  options: [
    {
      name: 'content',
      description: 'enter the edited message',
      type: ApplicationCommandOptionType.String,
      require: true
    },
    {
      name: 'id',
      description: 'enter message id that you want to edit',
      type: ApplicationCommandOptionType.String,
      require: true
    }
  ],
  userPermissions: PermissionFlagsBits.ManageMessages,
  run: async (client, interaction, args, secret, trans, langc, guild) => {
    try {
      const content = interaction.options.getString('content');
      const id = interaction.options.getString('id');
      client.channels.fetch(interaction.channelId).then(async chid => {
        // If there is message id
        if (id) {
          // Check if message id is valid
          // Check for length
          if (id.length !== 19) return interaction.reply({ content: `Please enter a valid message id.`, ephemeral: true });
          // Fetch message if length is 19
          const msg = await chid.messages.fetch(id);
          // Return if can't fetch message/invalid message id
          if (!msg) return interaction.reply({ content: `Please enter a valid message id.`, ephemeral: true });
          // Edit message
          msg.edit(content);
          // Reply to slash command user
          interaction.reply({ content: `${content} has been sent to <#${interaction.channelId}>`, ephemeral: true });
        }
        // If not provided
        else {
          interaction.reply({ content: `Please enter a valid message id`, ephemeral: true });
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
}
