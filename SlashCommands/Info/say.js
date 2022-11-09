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
      }
  ],
  DefaultMemberPermissions: PermissionFlagsBits.ManageMessages,
    run: async(client, interaction, args, secret) => {
        try {
          const content = interaction.options.getString('content');
          interaction.reply({ content: `${content} are being sent to <#${interaction.channelId}>`, ephemeral: true });
          client.channels.fetch(interaction.channelId).then(async chid => {
              chid.send(content)
          })
          } catch (e) {
            console.log(e)
          }
    }
  }