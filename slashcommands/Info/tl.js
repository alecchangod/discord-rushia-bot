const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require("@discordjs/builders")
const { ApplicationCommandOptionType, ButtonStyle } = require("discord.js")
const translate = require('@vitalets/google-translate-api');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: 'tl',
    description: 'tl',
    options: [
        {
            name: 'text',
            description: 'enter text that you want to translate',
            type: ApplicationCommandOptionType.String,
            require: true
        }
    ],
    run: async(client, interaction, guild,  args) => {
        const msg = interaction.options.getString('text')
        interaction.reply({
            content: "loading"
        })


        var trantext = ""
      var trantext = interaction.options.getString('text');
      if((!trantext) || (trantext.length = 0)) return await wait(2000), interaction.editReply('must provide text to translate!');
      translate(trantext, { to: 'zh-TW' }).then(res => {
        interaction.editReply(`原語言：${res.from.language.iso} \n 譯文： ${res.text} \n ||沒錯就是Google渣翻||`)
      })
    }
}