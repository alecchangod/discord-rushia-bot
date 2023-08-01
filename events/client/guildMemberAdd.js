// Imports the client library
const client = require('../../index.js')
const secret = require('../../config.json')
const trans = require('../../trans.json')
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });

//new member
client.on('guildMemberAdd', async (member) => {
  const cmd = 'joined';
  let command = client.info.get(cmd)
  if (!command) command = client.info.get(client.aliases.get(cmd));
  // Get language code from database or use server's one
  // var langc = await db.get(`lang_${member.guild.id}`) || member.guild.preferredLocale;
  // let trans = require(`../../trans/${langc}/${cmd}.json`);
  // var b_langc = secret.bot_lang;
  // let b_trans = require(`../../trans/${b_langc}/${cmd}.json`);
  if (command) command.run(client, secret, member, trans)
});