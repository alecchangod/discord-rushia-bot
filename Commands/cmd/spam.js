const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: "spam",
  aliases: ["spam"],
  description: 'spam message in a channel(owner only for now)',
  run: async (client, message, args, secret, prefix, trans, langc) => {
    // Check for user permission
    // If they have permission to run it
    if (message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      // Get the amount and content to send
      const [, amount, content] = message.content.split(' ');
      // Check if they input integer for amount
      if(!parseInt(amount)) return message.reply(`Please input command in the following format: \`\`\`{prefix}spam {amount of message to spam} {content to spam}\`\`\``);
      // If none provided/only one provided
      // Return and told them to re-enter
      if (!amount || !content) return message.reply('Must specify content and amount!');
      // Start spamming :)
      for (let i = 0; i < amount; i++) {
        message.channel.send(content);
      }
      // If they don't have permission to run this command
    } else {
      // Tell they they can't run it 
      message.reply("You don't have the required permission.")
    }
  }
}
