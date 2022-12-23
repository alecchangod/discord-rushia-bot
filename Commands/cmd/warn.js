const { PermissionsBitField } = require('discord.js');
module.exports = {
  name: "warn",
  aliases: ["warn"],
  description: 'warn a user',
  run: async (client, message, args, secret, prefix) => {
    try {
      var user = await message.guild.members.fetch(message.author)
      if (!user.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return message.channel.send("笑死你沒權限")
      if (message.author.bot) return message.reply("你是不會用自己賬號打嗎")
      const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
      if (!member) return message.reply("阿你到底要我禁誰")
      if (member.user.id === secret.botid) return message.reply('啊你怎麽那麽厲害可以禁言自己 \n 我不會欸, 怎麽辦')
      let reason0 = message.content.split(">");
      let reason1 = reason0[1]
      if (reason1.length == 0) var reason = ('欸我不知道');
      if (!reason1.length == 0) var reason = reason1;
      if (member.permissions.has('ADMINISTRATOR')) return message.reply('管管怎麽禁言')
      member.timeout(10 * 6 * 5 * 1000)
      message.channel.send("<@" + member + ">" + "誰讓你在這裡廢話？滾, 5分鐘後再回來（X")
        .catch(console.log);
      if (message.guild.id === secret.grp) {
        let channel = client.channels.fetch(secret.warn).then(channel => {
          channel.send('人:<@' + member + '>' + '\n原因:' + reason + '\n時間: 5分鐘')
        }).catch(err => { console.log(err) });
      };
      if (message.guild.id === secret.grp1) {
        let channel = client.channels.fetch(secret.warn1).then(channel => {
          channel.send('人:<@' + member + '>' + '\n原因:' + reason + '\n時間: 5分鐘')
        }).catch(err => { console.log(err) })
      };
    } catch (e) {
      console.log(e)
    }
  }
}