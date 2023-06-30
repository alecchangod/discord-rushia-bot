const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require("@discordjs/builders")
const { ApplicationCommandOptionType, ButtonStyle } = require("discord.js")

module.exports = {
  name: "warn",
  description: "warn user",
  options: [
    {
      name: 'member',
      description: 'user to warn',
      type: ApplicationCommandOptionType.String,
      require: true,
    },
    {
      name: 'reason',
      description: 'reason why muting',
      type: ApplicationCommandOptionType.String,
      require: true,
    },
    {
      name: 'time',
      description: 'time to mute',
      type: ApplicationCommandOptionType.String,
      require: true,
    },
    {
      name: 'channel',
      description: 'channel for warning',
      type: ApplicationCommandOptionType.String,
      require: true,
    }
  ],
  DefaultPermission: false,
  Permission: "Administrator",
  run: async (client, interaction, args, secret, trans, guild) => {
    try {
      await interaction.deferReply();
      if (!interaction.member.permissions.has('TIMEOUT_MEMBERS')) return interaction.editReply("笑死你沒權限")
      if (interaction.user.bot) return interaction.editReply("你是不會用自己賬號打嗎");
      const member = interaction.options.getString('member');
      const grp = interaction.guild.members.cache.get(member);
      console.log(grp);
      if ((!member) || (member.length == 0) || (!grp)) return interaction.editReply("阿你到底要我禁誰");
      if (member === secret.botid) return interaction.editReply('啊你怎麽那麽厲害可以禁言自己 \n 我不會欸, 怎麽辦');
      console.log(member, secret.botid)
      var reason = interaction.options.getString('reason');
      if ((!reason) || (reason.length == 0)) var reason = ('欸我不知道');
      var time = interaction.options.getString('time');
      if (interaction.guild.member(member).permissions.has('ADMINISTRATOR')) return interaction.editReply('管管怎麽禁言');
      member.timeout(10 * 6 * 5 * 1000)
      interaction.editReply(`<@${member}>誰讓你在這裡廢話？滾, ${time}分鐘後再回來（X`)
        .catch(console.log);
      var warn_ch = interaction.options.getString('channel');

      const discordServer = client.guilds.cache.get(interaction.guild.id);
const channels = discordServer?.channels ? JSON.parse(
  JSON.stringify(discordServer.channels)
).guild.channels : [];

      if ((warn_ch.length == 0) || (!warn_ch)) return;
      if ((warn_ch.length !== 18) || (!channels.include(warn_ch)) || (!channels.has(warn_ch))) return interaction.editReply("頻道ID錯誤");
      client.channels.fetch(warn_ch).then(channel => {
        channel.send(`人:<@${member}>\n原因:${reason}\n時間: ${time}分鐘`)
      }).catch(err => { console.log(err) })
    } catch (e) {
      console.log(e)
    }
  }
}