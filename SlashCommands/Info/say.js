const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require("@discordjs/builders")
const { ApplicationCommandOptionType, ButtonStyle } = require("discord.js")
const { PermissionFlagsBits } = require('discord-api-types/v10');

module.exports = {
  name: "say",
  description: "send message as bot",
  options: [
    {
      name: 'content',
      description: 'enter message that you want to send',
      type: ApplicationCommandOptionType.String,
      require: true
    },
    {
      name: 'id',
      description: 'enter message id that you want to reply',
      type: ApplicationCommandOptionType.String,
      require: false
    }
  ],
  userPermissions: PermissionFlagsBits.ManageMessages,
  run: async (client, interaction, args, secret, trans, langc, guild) => {
    try {
      const content = interaction.options.getString('content');
      const id = interaction.options.getString('id');
      client.channels.fetch(interaction.channelId).then(async chid => {
        if (id) {
          const msg = await chid.messages.fetch(id);
          if (!msg) return interaction.reply({ content: `Please provide a valid message id.`, ephemeral: true });
          msg.reply(content);
          interaction.reply({ content: `${content} has been sent to <#${interaction.channelId}>`, ephemeral: true });
        }
        else {
          chid.send(content);
          interaction.reply({ content: `${content} has been sent to <#${interaction.channelId}>`, ephemeral: true });
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
}