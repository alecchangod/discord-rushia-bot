const { PermissionsBitField } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/bad_word.sqlite" });

module.exports = {
  name: 'Blacklist',
  description: 'Ban words in a group (case sensitive)',
  run: async (client, message, args, secret, prefix, trans, langc) => {
    try {
        // Fetch message author
      const user = await message.guild.members.fetch(message.author);
    //   Get translation
      const missing_permission = trans.filter(it => it.name === "bl")[0].lang.filter(it => it.code === langc)[0].strings.filter(it => it.name === "missing_permission")[0].trans;
    //   Check for user permission
      if (!user.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        return message.channel.send(missing_permission);
      }

    //   Add or Del
      const det = message.content.toLowerCase().split(" ");
      const status = det[1];
    //   The word to ban/unban
      const word = det[2];

    //   Ban a word
      if (status === "add") {
        // Save server ID
        await db.push('group', message.guild.id);
        // Check if it was already banned
        const now = await db.get(message.guild.id);
        const already_banned = trans.filter(it => it.name === "bl")[0].lang.filter(it => it.code === langc)[0].strings.filter(it => it.name === "already_banned")[0].trans;
        if (JSON.stringify(now).includes(word)) {
          return message.reply(already_banned);
        }
        // Ban the word
        await db.push(`${message.guild.id}`, word);
        const banned = trans.filter(it => it.name === "bl")[0].lang.filter(it => it.code === langc)[0].strings.filter(it => it.name === "banned")[0].trans;
        // Give a reply after it was banned
        message.reply(`\`\`\`${word}\`\`\` ${banned} <a:isis:963826754328330300>`);
      }

    //   Unban a word
      if (status === "del") {
        // Check if it was banned
        const grp = await db.get('group');
        // If no word were banned in the server
        const no_word_banned = trans.filter(it => it.name === "bl")[0].lang.filter(it => it.code === langc)[0].strings.filter(it => it.name === "no_word_banned")[0].trans;
        if (!JSON.stringify(grp).includes(message.guild.id)) {
          return message.reply(no_word_banned);
        }
        // If it was not banned
        const now = await db.get(message.guild.id);
        const not_banned = trans.filter(it => it.name === "bl")[0].lang.filter(it => it.code === langc)[0].strings.filter(it => it.name === "not_banned")[0].trans;
        if (!JSON.stringify(now).includes(word)) {
          return message.reply(not_banned);
        }
        // Unban the word if it was banned before on this server
        await db.pull(`${message.guild.id}`, word);
        const unbanned = trans.filter(it => it.name === "bl")[0].lang.filter(it => it.code === langc)[0].strings.filter(it => it.name === "unbanned")[0].trans;
        message.reply(`\`\`\`${word}\`\`\` ${unbanned}`);
      }
    } catch (error) {
      console.error(`Error executing blacklist (bl) command: ${error}`);
    }
  }
};
