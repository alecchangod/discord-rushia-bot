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

  run: async (client, interaction, secret) => {
    // Parse Amount
    var usr = await message.guild.members.fetch(message.author)
    if (usr.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      let amount = interaction.options.getNumber('times');
      // if (amount = NaN) return interaction.reply("please provide a valid number.");
      const content = interaction.options.getString('content');
      interaction.reply({ content: `now sending ${amount} * ${content} to <#${interaction.channelId}>`, ephemeral: true });
      console.log(amount);
      // await wait(1000);
      client.channels.fetch(interaction.channelId).then(async chid => {
        for (let i = 0; i < amount; i++) {
          chid.send(content)
          await wait(100);
        }
      })
    }
    else message.reply("笑死你沒權限")
  }
}