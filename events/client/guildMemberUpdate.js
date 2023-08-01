// Imports the client library
const client = require('../../index.js')
const trans = require('../../trans.json')
const secret = require('../../config.json')
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });

//role change
client.on('guildMemberUpdate', async (oldMember, newMember) => {
  const cmd = 'member-update';
  let command = client.info.get(cmd)
  if (!command) command = client.info.get(client.aliases.get(cmd));
  // Get language code from database or use server's one
  var langc = await db.get(`lang_${newMember.guild.id}`) || newMember.guild.preferredLocale;
  let trans = require(`../../trans/${langc}/${cmd}.json`);
  var b_langc = secret.bot_lang;
  let b_trans = require(`../../trans/${b_langc}/${cmd}.json`);
  if (command) command.run(client, oldMember, newMember, secret, trans, b_trans)
});