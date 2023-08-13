const { PermissionsBitField } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/blacklist.sqlite" });

module.exports = {
  name: 'Blacklist',
  aliases: ["bl"],
  description: 'Ban words in a group (case sensitive)',
  trans: "blacklist",
  run: async (client, message, args, secret, prefix, trans) => {
    try {
      // Fetch message author
      const user = await message.guild.members.fetch(message.author);
      // Get translation
      const missing_permission = trans.strings.find(it => it.name === "missing_permission").trans;
      const invalid_status = trans.strings.find(it => it.name === "invalid_status").trans;
      const already_banned = trans.strings.find(it => it.name === "already_banned").trans;
      const banned = trans.strings.find(it => it.name === "banned").trans;
      const no_word_banned = trans.strings.find(it => it.name === "no_word_banned").trans;
      const not_banned = trans.strings.find(it => it.name === "not_banned").trans;
      const unbanned = trans.strings.find(it => it.name === "unbanned").trans;
      // Check for user permission
      if (!user.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        return message.channel.send(missing_permission);
      }

      // ban or unban
      const det = message.content.toLowerCase().split(" ");
      const status = det[1];
      // The word to ban/unban
      const word = det[2];

      // Ban a word
      if (status === "ban") {
        // Save server ID
        await db.push('group', message.guild.id);
        // Check if it was already banned
        const now = await db.get(message.guild.id);
        if (JSON.stringify(now).includes(word)) {
          return message.reply(already_banned);
        }
        // Ban the word
        await db.push(`${message.guild.id}`, word);
        // Give a reply after it was banned
        message.reply(`\`\`\`${word}\`\`\` ${banned} <a:isis:963826754328330300>`);
      }

      // Unban a word
      else if (status === "unban") {
        // Check if it was banned
        const grp = await db.get('group');
        // If no word were banned in the server
        if (!JSON.stringify(grp).includes(message.guild.id)) {
          return message.reply(no_word_banned);
        }
        // If it was not banned
        const now = await db.get(message.guild.id);
        if (!JSON.stringify(now).includes(word)) {
          return message.reply(not_banned);
        }
        // Unban the word if it was banned before on this server
        await db.pull(`${message.guild.id}`, word);
        message.reply(`\`\`\`${word}\`\`\` ${unbanned}`);
      }
      else return message.reply(invalid_status)
    } catch (error) {
      console.error(`Error executing blacklist (bl) command: ${error}`);
    }
  }
};
