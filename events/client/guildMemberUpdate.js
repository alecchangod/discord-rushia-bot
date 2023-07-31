// Imports the client library
const client = require('../../index.js')
const trans = require('../../trans.json')
const secret = require('../../config.json')

//role change
client.on('guildMemberUpdate', async (oldMember, newMember) => {
    const cmd = 'member-update';
    let command = client.info.get(cmd)
    if (!command) command = client.info.get(client.aliases.get(cmd));
    if (command) command.run(client, oldMember, newMember, secret, trans)
  });