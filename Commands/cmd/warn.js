const { PermissionsBitField } = require('discord.js');
module.exports = {
  name: "Warn",
  aliases: ["warn"],
  description: 'warn user',
  run: async (client, message, args, secret, prefix, trans, langc) => {
    try {
      // Fetch message author
      var user = await message.guild.members.fetch(message.author)
      // Check for ModerateMembers permission
      if (!user.permissions.has(PermissionsBitField.Flags.ModerateMembers))
        return message.channel.send("笑死你沒權限");
      // Block bot account
      if (message.author.bot)
        return message.reply("你是不會用自己賬號打嗎");
      // Get user to timeout
      const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      // If no user provided
      // Ask them to re-enter a user
      if (!member)
        return message.reply("阿你到底要我禁誰");
      // I can't and will never timeout myself xD
      if (member.user.id === secret.botid)
        return message.reply('啊你怎麽那麽厲害可以禁言自己 \n 我不會欸, 怎麽辦');
      // Check for reason to timeout
      // Use IDK if not provided :))
      const reason = message.content.split(">")[1] || '欸我不知道';
      // I can't timeout Admin :/
      if (member.permissions.has(PermissionsBitField.Flags.Administrator))
        return message.reply('管管怎麽禁言');
      // Timeout for 5 minutes
      member.timeout(1000 * 60 * 5);
      // Mention the user and tell the that they have been banned
      message.channel.send("<@" + member + ">" + "誰讓你在這裡廢話？滾, 5分鐘後再回來（X")
        .catch(console.log);
      // If there is a warning channel
      // Working on a command to set it. For now, was hardcoded and for private use only.
      let channel_id = message.guild.id === secret.grp ? secret.warn : secret.warn1;
      // Send message to the warning channel
      const channel = await client.channels.fetch(channel_id);
      channel.send(`人:<@${member}>\n原因:${reason}\n時間: 5分鐘`).catch(console.log);
      
    } catch (e) {
      console.log(e)
    }
  }
}
