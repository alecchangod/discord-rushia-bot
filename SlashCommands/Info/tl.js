const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require("@discordjs/builders"),
      { ApplicationCommandOptionType, ButtonStyle } = require("discord.js"),
      wait = require('node:timers/promises').setTimeout,
      { QuickDB } = require("quick.db"),
      db = new QuickDB({ filePath: "database/lang.sqlite" }),
      { translate } = require("@almeidx/translate"),
      lang = require('../../lang.json');

module.exports = {
  data: {
    name: 'tl',
    description: 'tl',
    options: [
        {
            name: 'text',
            description: 'enter text that you want to translate',
            type: ApplicationCommandOptionType.String,
            require: true
        },
        {
            name: 'original-lang',
            description: 'enter original language',
            type: ApplicationCommandOptionType.String,
            require: true
        },
        {
            name: 'tar-lang',
            description: 'enter target language',
            type: ApplicationCommandOptionType.String,
            require: true
        }
    ],
},
    async execute(client, interaction, args, secret, trans, langc, guild) {
        interaction.reply({
            content: "loading"
        })

        var trantext = "",
            trantext = interaction.options.getString('text'),
            tarlang = interaction.options.getString('tar-lang'),
            orilang = interaction.options.getString('original-lang');
        if ((!tarlang) || (tarlang.length = 0)) var tarlang = await db.get(`${interaction.guild.id}_lang`);
        await wait(500);
        if ((!orilang) || (orilang.length = 0)) var orilang = "auto";
        if (tarlang === null) var tarlang = "zh-TW";
        if (JSON.stringify(lang).includes(tarlang) === false) return await wait(2000), interaction.editReply("please input a valid language code.");
        if ((!trantext) || (trantext.length = 0)) return await wait(2000), interaction.editReply('must provide text to translate!');
        const translation = await translate(trantext, tarlang, orilang);
        await interaction.editReply(`語言：${translation.sourceLang} ==> ${translation.targetLang} \n 譯文： ${translation.translation} \n ||沒錯就是Google渣翻||`);
    }
}