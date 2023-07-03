const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require("@discordjs/builders")
const { ApplicationCommandOptionType, ButtonStyle, PermissionsBitField } = require("discord.js")
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  data: {
    name: "spam",
    description: "spam message in a channel (owner only for now)",
    options: [
      {
        name: 'content',
        description: 'Enter message that you want to send',
        type: ApplicationCommandOptionType.String,
        required: true
      },
      {
        name: 'amount',
        description: 'Enter amount of messages to send',
        type: ApplicationCommandOptionType.Integer,
        required: true
      }
    ]
  },
  userPermissions: PermissionsBitField.Flags.ManageMessages,
  async execute(client, interaction, args, secret, trans, langc, guild) {
    if (interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      const amount = interaction.options.getInteger('amount');
      const content = interaction.options.getString('content');

      interaction.reply({ content: `Now sending ${amount} * ${content} to <#${interaction.channelId}>`, ephemeral: true });

      for (let i = 0; i < amount; i++) {
        await interaction.channel.send(content);
        await wait(100);
      }
    } else {
      await interaction.reply("You don't have the required permission.");
    }
  },
};