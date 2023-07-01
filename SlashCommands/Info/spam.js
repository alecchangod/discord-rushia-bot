const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require("@discordjs/builders")
const { ApplicationCommandOptionType, ButtonStyle, PermissionsBitField } = require("discord.js")
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  name: "spam",
  description: "spam",
  required: true,
  options: [
    {
      name: 'content',
      description: 'enter message that you want to send',
      type: ApplicationCommandOptionType.String,
      require: true
    },
    {
      name: 'times',
      description: 'enter times of message to send',
      type: ApplicationCommandOptionType.Number,
      require: false
    }
  ],

  run: async (client, interaction, args, secret, trans, langc, guild) => {
    // Parse Amount
    var usr = interaction.member;
    if (usr.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      let amount = interaction.options.getNumber('times');
      const content = interaction.options.getString('content');
      interaction.reply({ content: `now sending ${amount} * ${content} to <#${interaction.channelId}>`, ephemeral: true });
      client.channels.fetch(interaction.channelId).then(async chid => {
        for (let i = 0; i < amount; i++) {
          chid.send(content)
          await wait(100);
        }
      })
    }
    else interaction.reply("笑死你沒權限")
  }
}