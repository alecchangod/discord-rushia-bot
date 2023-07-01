// Imports the client library
const client = require('../../index.js')
const trans = require('../../trans.json')
const secret = require('../../config.json')
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });

//message delete log
client.on('messageDelete', async (message) => {
    if (!message.guild) return;
    const cmd = 'delete-logger';
    let command = client.info.get(cmd)
    if (!command) command = client.info.get(client.aliases.get(cmd));
    // Getting group language from the database
    var langc = await db.get(`lang_${message.guild.id}`);
    var langc = trans.filter(it => it.code === langc)[0]?.name;
    if (langc == undefined) var langc = message.guild.preferredLocale;
    if (command) command.run(client, message, secret, trans, langc)
});

//dm delete detect
client.on('messageDelete', async (message) => {
    if (message.channel.type == 1) {
        const cmd = 'dm-delete-logger';
        let command = client.info.get(cmd)
        if (!command) command = client.info.get(client.aliases.get(cmd));
        // Getting group language from the database
        var langc = await db.get(`lang_${message.guild.id}`);
        var langc = trans.filter(it => it.code === langc)[0]?.name;
        if (langc == undefined) var langc = message.guild.preferredLocale;
        if (command) command.run(client, message, secret, trans, langc)
    }
});