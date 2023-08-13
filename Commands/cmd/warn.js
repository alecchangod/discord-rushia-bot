const { PermissionsBitField } = require('discord.js');
module.exports = {
  name: "Warn",
  aliases: ["warn"],
  description: 'Timeout a user for 5 minutes',
  trans: "moderate",
  run: async (client, message, args, secret, prefix, trans, langc) => {
    try {
      // Fetch message author
      var user = await message.guild.members.fetch(message.author)
      // Check for ModerateMembers permission
      const missing_permission = trans.strings.find(it => it.name === "missing_permission").trans;
      if (!user.permissions.has(PermissionsBitField.Flags.ModerateMembers))
        return message.channel.send(missing_permission);
      // Block bot account
      const bot = trans.strings.find(it => it.name === "bot").trans;
      if (message.author.bot)
        return message.reply(`${bot} <:pekora_whatwrongwithyou:976146270743855217>`);
      // Check if the bot has the required permission
      const no_perm = trans.strings.find(it => it.name === "no_perm").trans;
      if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return interaction.reply(no_perm);
      // Get user to timeout
      const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      // If no user provided
      // Ask them to re-enter a user
      const no_member = trans.strings.find(it => it.name === "no_member").trans;
      if (!member)
        return message.reply(`${no_member} <:cmonBruh:961592205485670420>`);
      // I can't and will never timeout myself xD
      const warn_yourself = trans.strings.find(it => it.name === "warn_yourself").trans;
      if (member.user.id === secret.botid)
        return message.reply(`${warn_yourself} <a:z_sui_eating:976448366781267998>`);
      // Check for reason to timeout
      // Use IDK if not provided :))
      const idk = trans.strings.find(it => it.name === "idk").trans;
      const reason = message.content.split(">")[1] || `${idk} <:0V0:970325975810334750>`;
      // I can't timeout Admin :/
      const warn_admin = trans.strings.find(it => it.name === "warn_admin").trans;
      if (member.permissions.has(PermissionsBitField.Flags.Administrator))
        return message.reply(`${warn_admin} <:emoji_34:961594390994882570>`);
      // Timeout for 5 minutes
      member.timeout(1000 * 60 * 5);
      // Mention the user and tell the that they have been banned
      const stfu = trans.strings.find(it => it.name === "stfu").trans;
      const min = trans.strings.find(it => it.name === "min").trans;
      message.channel.send(`<@${member}>${stfu}5${min}<:bananaV3:958346989597241344>`)
        .catch(console.log);
      // If there is a warning channel
      // Working on a command to set it. For now, was hardcoded and for private use only.
      let channel_id = message.guild.id === secret.grp ? secret.warn : message.guild.id === secret.grp1 ? secret.warn1 : null;
      if (!channel_id) return;
      // Send message to the warning channel
      const channel = await client.channels.fetch(channel_id);
      const warn = trans.strings.find(it => it.name === "warn").trans;
      const human = trans.strings.find(it => it.name === "human").trans;
      const why = trans.strings.find(it => it.name === "why").trans;
      const time = trans.strings.find(it => it.name === "time").trans;
      channel.send(`**${warn}**\n${human}: <@${member}>\n${why}: ${reason}\n${time}: 5${min}`).catch(console.log);

    } catch (e) {
      console.log(e)
    }
  }
}
