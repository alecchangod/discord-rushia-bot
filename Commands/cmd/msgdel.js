const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: "Purge",
  aliases: ["msgdel"],
  description: 'purge message to delete (ONLY less than 14 days)',
  trans: "purge",
  run: async (client, message, args, secret, prefix, trans) => {
    try {

      // Check if message author have permission to delete message
      const usr = await message.guild.members.fetch(message.author);
      const missing_permission = trans.strings.find(it => it.name === "missing_permission").trans;
      if (!usr.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        return message.reply(missing_permission);
      }

      // Get amount to delete from message
      var amount = parseInt(message.content.split(' ')[1]) || parseInt(message.content.split(' ')[2]);
      // MUST have an amount defined in message
      const no_amount = trans.strings.find(it => it.name === "no_amount").trans;
      if (!amount) {
        return message.reply(no_amount);
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
      const msg_del = trans.strings.find(it => it.name === "msg_del").trans;
      message.channel.send(`<@${message.author.id}> ${msg_del} * ${messagesDeleted}`);

    } catch (error) {
      console.error(`Error executing msgdel command: ${error}`);
    }
  }
};
