// Imports the client library
const client = require('../../index.js')
const secret = require('../../config.json')

//new member
client.on('guildMemberAdd', async member => {
    const cmd = 'join';
    let command = client.commands.get(cmd)
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (command) command.run(client, secret, member)
  });