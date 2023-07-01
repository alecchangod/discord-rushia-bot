// Imports the client library
const client = require('../../index.js')
const trans = require('../../trans.json')
const secret = require('../../config.json')
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });

client.on('messageUpdate', async (oldMessage, newMessage) => {
    let cmd;
    // For server messages
    if (newMessage.guild) {
        cmd = 'message-update';
    } else if (newMessage.channel.type == 1) {
    // For DMs
        cmd = 'dm-edit-logger';
    } else {
        return;
    }

    let command = client.info.get(cmd)
    if (!command) command = client.info.get(client.aliases.get(cmd));

    // Get language code from database or use server's one
    var langc = await db.get(`lang_${newMessage.guild.id}`) || newMessage.guild.preferredLocale;
    if (command) command.run(client, oldMessage, newMessage, secret, trans, langc)
});