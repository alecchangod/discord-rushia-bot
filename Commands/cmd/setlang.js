const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require("@discordjs/builders")
const { ApplicationCommandOptionType, ButtonStyle, Message } = require("discord.js")
const wait = require('node:timers/promises').setTimeout;
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });
const { translate } = require("@almeidx/translate");
const lang = require('../../lang.json')


module.exports = {
    name: 'setlang',
    description: 'Set Group Language',
    run: async (client, message) => {
        message.reply("loading...").then(async msg => {
            var slang = message.content.split(" ")[1];
            if (JSON.stringify(lang).includes(slang) === false) return await wait(2000), msg.edit("please input a valid language code.");
            await db.set(`${message.guild.id}_lang`, slang);
            var nlang = await db.get(`${message.guild.id}_lang`);
            var nlangn = lang.filter(it => it.code === nlang)[0]?.name;
            await wait(2000);
            msg.edit(`new preferred translate language was setted to ${nlangn} (${nlang}) .`)
        })

    }
}