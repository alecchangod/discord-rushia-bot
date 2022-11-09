// Imports the client library
const client = require('../../index.js')
const secret = require('../../config.json')

//message edit
client.on('messageUpdate', async (oldMessage, newMessage) => {
    if (!newMessage.guildId) return;
    const cmd = 'msgupdate';
      let command = client.commands.get(cmd)
      if (!command) command = client.commands.get(client.aliases.get(cmd));
      if (command) command.run(client, oldMessage, newMessage, secret)
  });
  
//dm edit detect
client.on('messageUpdate', async (oldMessage, newMessage) => {
    if (newMessage.channel.type == 1) {
      const cmd = 'pm-edit-logger';
      let command = client.commands.get(cmd)
      if (!command) command = client.commands.get(client.aliases.get(cmd));
      if (command) command.run(client, oldMessage, newMessage, secret)
    }
  });