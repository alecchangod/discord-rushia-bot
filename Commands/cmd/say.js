module.exports = {
  name: "say",
  aliases: ["say"],
  description: 'send message as bot(owner only for now)',
  run: async (client, message, args, secret, prefix, trans) => {
    try {
      if (((message.guild.id === secret.grp1) && (message.member.roles.cache.some(role => role.name == "test") || message.member.roles.cache.some(role => role.name == "元首") || message.member.roles.cache.some(role => role.name == "管理員") || message.member.roles.cache.some(role => role.name == "神志不清的天才寶特瓶"))) || ((message.guild.id === secret.grp) && (message.member.roles.cache.some(role => role.name == "大哥") || message.member.roles.cache.some(role => role.name == "管理員")))) {
        var q = message.content.substring(4,);
        if (message.reference) {
          const repliedTo = await message.channel.messages.fetch(message.reference.messageId)
          message.reply({ content: q, reply: { messageReference: repliedTo.id } })
          if (!repliedTo) return message.channel.send(q)
        }
        else {
          message.channel.send(q)
        }

        message.delete()
      }
    } catch (e) {
      console.log(e)
    }
  }
}