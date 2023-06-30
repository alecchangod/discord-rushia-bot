const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: "Purge",
  aliases: ["m", "msgdel"],
  description: 'purge message to delete (ONLY less than 14 days)',
  run: async (client, message, args, secret, prefix, trans, langc) => {
    try {
      // const user = message.mentions.users.first();

      // Check if message author have permission to delete message
      const usr = await message.guild.members.fetch(message.author);
      if (!usr.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        return message.reply("笑死你沒權限");
      }

      // Get amount to delete from message
      var amount = parseInt(message.content.split(' ')[1]) || parseInt(message.content.split(' ')[2]);
      // MUST have an amount defined in message
      if (!amount) {
        return message.reply('Must specify an amount to delete!');
      }
      // Include the message sent to run this command
      amount++;

      // Start counting
      let messagesDeleted = 0;
      let fetchedMessages;

      do {
        fetchedMessages = await message.channel.messages.fetch({ limit: Math.min(amount, 100) });
        message.channel.bulkDelete(fetchedMessages).catch(error => console.log(error.stack));
        messagesDeleted += fetchedMessages.size;
        amount -= fetchedMessages.size;
      } while (amount > 0);
      // Give an reply after deleting required message
      message.channel.send(`@${message.author.id} I have deleted ${messagesDeleted} messages.`);

    } catch (error) {
      console.error(`Error executing msgdel command: ${error}`);
    }
  }
};
