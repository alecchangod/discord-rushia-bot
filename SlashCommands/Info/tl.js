const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require("@discordjs/builders")
const { ApplicationCommandOptionType, ButtonStyle } = require("discord.js")
const wait = require('node:timers/promises').setTimeout;
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/lang.sqlite" });
const { translate } = require("@almeidx/translate");
const lang = require('../../lang.json')


module.exports = {
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
    run: async (client, interaction, guild, args) => {
        interaction.reply({
            content: "loading"
        })


        var trantext = ""
        var trantext = interaction.options.getString('text');
        var tarlang = interaction.options.getString('tar-lang');
        var orilang = interaction.options.getString('original-lang');
        if ((!tarlang) || (tarlang.length = 0)) var tarlang = await db.get(`${interaction.guild.id}_lang`);
        await wait(100);
        if ((!orilang) || (orilang.length = 0)) var orilang = "auto";
        if (tarlang === null) var tarlang = "zh-TW";
        if(JSON.stringify(lang).includes(tarlang) === false) return await wait(2000), interaction.editReply("please input a valid language code.");
        // var ori = translate.languages[orilang];
        // console.log(orilang, tarlang, tar, ori);
        // if (tar === undefined) return await wait(2000), interaction.editReply("please input a valid language code.");
        // if (ori === undefined) return await wait(2000), interaction.editReply("please input a valid language code.");
        if ((!trantext) || (trantext.length = 0)) return await wait(2000), interaction.editReply('must provide text to translate!');
        const translation = await translate(trantext, tarlang, orilang);
        interaction.editReply(`語言：${translation.sourceLang} ==> ${translation.targetLang} \n 譯文： ${translation.translation} \n ||沒錯就是Google渣翻||`)
    }
}