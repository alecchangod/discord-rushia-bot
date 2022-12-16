const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require("@discordjs/builders")
const { ApplicationCommandOptionType, ButtonStyle } = require("discord.js")
const wait = require('node:timers/promises').setTimeout;
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" }); 
const { translate } = require("@almeidx/translate");
const lang = require('../../lang.json')


module.exports = {
    name: 'setlang',
    description: 'Set Group Language',
    options: [
        {
            name: 'lang',
            description: 'enter target language',
            type: ApplicationCommandOptionType.String,
            require: true
        }
    ],
    run: async(client, interaction, guild,  args) => {
      interaction.reply("loading...")
      var userMember = await message.guild.members.fetch(message.author)
        //     console.log(userMember.permissions.has(PermissionsBitField.Flags.ManageGuild))
      if(!userMember.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.editReply("You don't have permission to change the server language code. Ask help from admin or server owner.");
      var slang = interaction.options.getString('lang');
      if(JSON.stringify(lang).includes(slang) === false) return await wait(2000), interaction.editReply("please input a valid language code.");
      await db.set(`${interaction.guild.id}_lang`, slang);
      var nlang = await db.get(`${interaction.guild.id}_lang`);
      await wait(2000);
      interaction.editReply(`new preferred translate language was setted to ${nlang} .`)
    }
}