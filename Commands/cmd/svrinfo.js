const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });
module.exports = {
    name: 'svrinfo',
    aliases: ['info', 'server-info'],
    description: 'Get serer info',
    run: async (client, message, args, prefix) => {

        // Getting prefix from the database:
        const pre = await db.get(`prefix_${message.guild.id}`);
        const author = await db.get(`c_${message.guild.id}`);
        const time = await db.get(`t_${message.guild.id}`);

        // Getting group language from the database
        const lang = await db.get(`${message.guild.id}_lang`);

        if (pre == null) { pre = `=(Default)` }
        var msg = `**Info for ${message.guild.name}** \n \n Group Language Code: ${lang} \n \n Current prefix: ${pre} \n Set by ${author} \n At <t:${time}>`;
        message.reply(msg)
    }
}