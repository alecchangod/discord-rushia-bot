// Imports the client library
const client = require('../../index.js')
const trans = require('../../trans.json')
const secret = require('../../config.json')

//message delete log
client.on('messageDelete', async (message) => {
    if (!message.guild) return;
    const cmd = 'delete-logger';
    let command = client.info.get(cmd)
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (command) command.run(client, message, secret, trans)
});

//dm delete detect
client.on('messageDelete', async (message) => {
    if (message.channel.type == 1) {
        const cmd = 'pm-delete-logger';
        let command = client.info.get(cmd)
        if (!command) command = client.info.get(client.aliases.get(cmd));
        if (command) command.run(client, message, secret, trans)
    }
});