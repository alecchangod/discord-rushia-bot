const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "Spam",
  aliases: ["spam"],
  description: "spam message in a channel",
  trans: "spam",
  run: async (client, message, args, secret, prefix, trans) => {
    // Check for user permission
    // If they have permission to run it
    if (
      message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)
    ) {
      // Get the amount and content to send
      const [, amount, content] = message.content.split(" ");
      // If none provided/only one provided
      // Return and told them to re-enter
      const no_cont_amount = trans.strings.find(
        (it) => it.name === "no_cont_amount"
      ).trans;
      if (!amount || !content) return message.reply(no_cont_amount);
      // Check if they input integer for amount
      const not_integer = trans.strings.find(
        (it) => it.name === "not_integer"
      ).trans;
      if (!parseInt(amount)) return message.reply(not_integer);
      // Start spamming :)
      for (let i = 0; i < amount; i++) {
        message.channel.send(content);
      }
      // If they don't have permission to run this command
    } else {
      // Tell they they can't run it
      const missing_permission = trans.strings.find(
        (it) => it.name === "missing_permission"
      ).trans;
      message.reply(missing_permission);
    }
  },
};
