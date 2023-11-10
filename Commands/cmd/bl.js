const { PermissionsBitField } = require("discord.js");
const bl = require("../../function/common/bl.js");

module.exports = {
  name: "Blacklist",
  aliases: ["bl"],
  description: "Ban words in a group (case sensitive)",
  trans: "blacklist",
  run: async (client, message, args, secret, prefix, trans) => {
    try {
      // Fetch message author
      const user = await message.guild.members.fetch(message.author);
      // ban or unban
      const det = message.content.toLowerCase().split(" ");
      const status = det[1];
      // The word to ban/unban
      const word = det[2];
      // Run the commands
      bl(message, secret, trans, user, status, word);
    } catch (error) {
      console.error(`Error executing blacklist (bl) command: ${error}`);
    }
  },
};
