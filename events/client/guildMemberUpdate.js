// Imports the client library
const client = require('../../index.js')

//role change
client.on('guildMemberUpdate', async (oldMember, newMember) => {
    const cmd = 'mupdate';
    let command = client.info.get(cmd)
    if (!command) command = client.info.get(client.aliases.get(cmd));
    if (command) command.run(client, oldMember, newMember, trans)
  });