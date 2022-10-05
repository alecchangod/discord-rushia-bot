const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require("@discordjs/builders")
const { ApplicationCommandOptionType, ButtonStyle } = require("discord.js")

module.exports = {
    name: "say", 
    description: "send message as bot",
    options: [
      {
          name: 'content',
          description: 'enter message that you want to send',
          type: ApplicationCommandOptionType.String,
          require: true
      }
  ],
    run: async(client, interaction, args, secret) => {
        try {
            // if (((interaction.guild.id === secret.grp1) && (interaction.member.roles.cache.some(role => role.name == "test") || interaction.member.roles.cache.some(role => role.name == "元首") || interaction.member.roles.cache.some(role => role.name == "管理員") || interaction.member.roles.cache.some(role => role.name == "神志不清的天才寶特瓶") )) || ((interaction.guild.id === secret.grp) && (interaction.member.roles.cache.some(role => role.name == "大哥") || interaction.member.roles.cache.some(role => role.name == "管理員") ))) {
              var q = interaction.options.getString('content');
              interaction.reply(q)
            //}
          } catch (e) {
            console.log(e)
          }
    }
  }