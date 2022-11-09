// Imports the client library
const client = require('../../index.js')
const secret = require('../../config.json')

//message delete log
client.on('messageDelete', async (message) => {
    if (!message.guild) return;
    const cmd = 'delete-logger';
    let command = client.commands.get(cmd)
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (command) command.run(client, message, secret)
});

//dm delete detect
client.on('messageDelete', async (message) => {
    if (message.channel.type == 1) {
        const cmd = 'pm-delete-logger';
        let command = client.commands.get(cmd)
        if (!command) command = client.commands.get(client.aliases.get(cmd));
        if (command) command.run(client, message, secret)
    }
});