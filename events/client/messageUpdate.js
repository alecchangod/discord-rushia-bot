// Imports the client library
const client = require('../../index.js')
const trans = require('../../trans.json')
const secret = require('../../config.json')
const { QuickDB } = require("quick.db");
const svr = new QuickDB({ filePath: "database/server.sqlite" });

//message edit
client.on('messageUpdate', async (oldMessage, newMessage) => {
  if (!newMessage.guildId) return;
  const cmd = 'msgupdate';
  let command = client.info.get(cmd)
  if (!command) command = client.info.get(client.aliases.get(cmd));
  // Getting group language from the database
  const langc = await svr.get(`${newMessage.guild.id}_lang`);
  if (command) command.run(client, oldMessage, newMessage, secret, trans, langc)
});

//dm edit detect
client.on('messageUpdate', async (oldMessage, newMessage) => {
  if (newMessage.channel.type == 1) {
    const cmd = 'pm-edit-logger';
    let command = client.info.get(cmd)
    if (!command) command = client.info.get(client.aliases.get(cmd));
    // Getting group language from the database
    const langc = await svr.get(`${newMessage.guild.id}_lang`);
    if (command) command.run(client, oldMessage, newMessage, secret, trans, langc)
  }
});