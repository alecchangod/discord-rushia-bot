// Imports the client library
const client = require('../../index.js')
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
        cmd = 'dms-delete-logger';
    } else {
        return;
    }

    let command = client.info.get(cmd)
    if (!command) command = client.info.get(client.aliases.get(cmd));

    // Get language code from database or use server's one
    var langc = message.guild ? await db.get(`lang_${message.guild.id}`) || message.guild.preferredLocale : secret.bot_lang;
    let trans = require(`../../trans/${langc}/${cmd}.json`);
    var b_langc = secret.bot_lang;
    let b_trans = require(`../../trans/${b_langc}/${cmd}.json`);
    if (command) command.run(client, message, secret, trans, b_trans, langc)
});