// Imports the client library
const client = require('../../index.js')
const trans = require('../../trans.json')
const secret = require('../../config.json')
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });

//message delete log
client.on('messageDelete', async (message) => {
    let cmd;
    // For server messages
    if (message.guild) {
        cmd = 'delete-logger';
    } else if (message.channel.type == 1) {
    // For DMs
        cmd = 'dm-delete-logger';
    } else {
        return;
    }

    let command = client.info.get(cmd)
    if (!command) command = client.info.get(client.aliases.get(cmd));

    // Get language code from database or use server's one
    var langc = await db.get(`lang_${message.guild.id}`) || message.guild.preferredLocale;
    if (command) command.run(client, message, secret, trans, langc)
});