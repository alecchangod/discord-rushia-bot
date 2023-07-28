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
        return message.channel.send("笑死你沒權限 <a:isis:963826754328330300>");
      // Block bot account
      if (message.author.bot)
        return message.reply("你是不會用自己賬號打嗎 <:pekora_whatwrongwithyou:976146270743855217>");
      // Get user to timeout
      const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      // If no user provided
      // Ask them to re-enter a user
      if (!member)
        return message.reply("阿你到底要我禁誰 <:cmonBruh:961592205485670420>");
      // I can't and will never timeout myself xD
      if (member.user.id === secret.botid)
        return message.reply('啊你怎麽那麽厲害可以禁言自己, 我不會欸, 怎麽辦 <a:z_sui_eating:976448366781267998>');
      // Check for reason to timeout
      // Use IDK if not provided :))
      const reason = message.content.split(">")[1] || '欸我不知道 <:0V0:970325975810334750>';
      // I can't timeout Admin :/
      if (member.permissions.has(PermissionsBitField.Flags.Administrator))
        return message.reply('管管怎麽禁言 <:emoji_34:961594390994882570>');
      // Check if the bot has the required permission
      if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return interaction.reply('你確定要叫一個沒權限禁言的人來幫你?');
      // Timeout for 5 minutes
      member.timeout(1000 * 60 * 5);
      // Mention the user and tell the that they have been banned
      message.channel.send("<@" + member + ">" + "誰讓你在這裡廢話？滾, 5分鐘後再回來（X <:bananaV3:958346989597241344>")
        .catch(console.log);
      // If there is a warning channel
      // Working on a command to set it. For now, was hardcoded and for private use only.
      let channel_id = message.guild.id === secret.grp ? secret.warn : message.guild.id === secret.grp1 ? secret.warn1 : null;
      if (!channel_id) return;
      // Send message to the warning channel
      const channel = await client.channels.fetch(channel_id);
      channel.send(`**Timeout**\n人:<@${member}> <:bananaV3:958346989597241344>\n原因:${reason}\n時間: 5分鐘`).catch(console.log);

    } catch (e) {
      console.log(e)
    }
  }
}
