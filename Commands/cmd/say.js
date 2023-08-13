module.exports = {
  name: "Say",
  aliases: ["say"],
  description: 'send message as bot(owner only for now)',
  trans: "say",
  run: async (client, message, args, secret, prefix, trans) => {
    try {
        // Get message to send
        const q = message.content.substring(4);
        const no_text = trans.strings.find(it => it.name === "no_text").trans;
        if (!q) return message.reply(no_text);
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
    } catch (error) {
      console.log(`Error running say command: ${error}`);
    }
  }
};
