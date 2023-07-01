const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require("@discordjs/builders")
const { ApplicationCommandOptionType, ButtonStyle, Message } = require("discord.js")
const wait = require('node:timers/promises').setTimeout;
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });
const { translate } = require("@almeidx/translate");
const lang = require('../../lang.json')


module.exports = {
    name: 'Set Language',
    aliases: ["setlang"],
    description: 'Set Group Language',
    run: async (client, message, args, secret, prefix, trans, langc) => {
      try {
        // Check if provided language was valid
        const slang = message.content.split(" ")[1];
        // If they inputed an invalid language code
        // Return and make them to re-enter a valid code
        if (!lang.some(it => it.code === slang)) return message.reply("please input a valid language code.");
        // If it was valid
        // Save the language code
        await db.set(`lang_${message.guild.id}`, slang);
        const nlang = await db.get(`lang_${message.guild.id}`);
        const nlangn = lang.find(it => it.code === nlang)?.name;
        // Give a reply after saving the language code
        const replyMessage = `New preferred translate language was set to ${nlangn} (${nlang}).`;
        await message.reply("loading...").then(async msg => {
          await wait(2000);
          msg.edit(replyMessage);
        });
      } catch (e) {
        console.log(e);
      }
    }
  };
