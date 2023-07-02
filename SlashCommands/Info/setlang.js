const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require("@discordjs/builders");
const { ApplicationCommandOptionType, ButtonStyle, Message, CommandInteraction } = require("discord.js");
const wait = require('node:timers/promises').setTimeout;
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });
const { translate } = require("@almeidx/translate");
const lang = require('../../lang.json');

module.exports = {
  data: {
    name: "setlang",
    description: 'Set Group Language',
    options: [
      {
        name: 'language',
        type: ApplicationCommandOptionType.String,
        description: 'Language code to be set',
        required: true,
      },
    ],
  },
  
  async execute(client, interaction, args, secret, trans, langc, guild) {
    try {
      // Get interaction information
      const guildId = interaction.guildId;
      const author = interaction.user.id;
      // Check if provided language was valid
      const slang = interaction.options.getString('language');
      // If they inputed an invalid language code
      // Return and make them to re-enter a valid code
      if (!lang.some(it => it.code === slang)) return interaction.reply({ content: "please input a valid language code.", ephemeral: true });
      // If it was valid
      // Save the language code
      await db.set(`lang_${guildId}`, slang);
      // Save the user name which changed the language
      await db.set(`lang_c_${guildId}`, author);
      // Save the time for changing it
      const timestamp = Math.floor(Date.now() / 1000);
      await db.set(`lang_t_${guildId}`, timestamp);
      // Check if it was saved
      const langFromDb = await db.get(`lang_${guildId}`);
      const authorFromDb = await db.get(`lang_c_${guildId}`);
      const timeFromDb = await db.get(`lang_t_${guildId}`);
      const lang_name = lang.filter(it => it.code === langFromDb)[0]?.name;
      // Give a reply after saving the language code
      const replyMessage = `New preferred translate language was set to ${langFromDb} (${lang_name}) \n by <@${authorFromDb}> \n at <t:${timeFromDb}>`;
      
      await interaction.reply("loading...");
      await wait(2000);
      await interaction.editReply(replyMessage);
      
    } catch (e) {
      console.log(e);
      await interaction.channel.send({ content: 'An error occurred while executing the command.'});
    }
  },
};
