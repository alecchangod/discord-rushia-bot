module.exports = {
  name: "say",
  aliases: ["say"],
  description: 'send message as bot(owner only for now)',
  run: async (client, message, args, secret, prefix, trans, langc) => {
    try {
      // Allow these roles in server (1) and (2)
      const allowedRolesGrp1 = ["test", "元首", "管理員", "神志不清的天才寶特瓶"];
      const allowedRolesGrp2 = ["大哥", "管理員"];
      // Check if user was allowed to run this command. If not, their message will be ignored.
      const isAllowedGrp1 = message.guild.id === secret.grp1 && message.member.roles.cache.some(role => allowedRolesGrp1.includes(role.name));
      const isAllowedGrp2 = message.guild.id === secret.grp && message.member.roles.cache.some(role => allowedRolesGrp2.includes(role.name));
      // If they were allowed
      if (isAllowedGrp1 || isAllowedGrp2) {
        // Get message to send
        const q = message.content.substring(4);
        // Check if the user was replying to another message
        // If they were, send the message as an reply
        if (message.reference) {
          const repliedTo = await message.channel.messages.fetch(message.reference.messageId);
          message.reply({ content: q, reply: { messageReference: repliedTo.id } });
          if (!repliedTo) return message.channel.send(q);
        } 
        // If not, send the message normally 
        else {
          message.channel.send(q);
        }
        // Delete user's message after sending
        message.delete();
      }
    } catch (error) {
      console.log(`Error running say command: ${error}`);
    }
  }
};
