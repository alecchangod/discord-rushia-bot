const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });
const lang = require('../../lang.json')
module.exports = {
    name: 'svrinfo',
    aliases: ['info', 'server-info'],
    description: 'Get serer info',
    run: async (client, message, args, prefix) => {
        // Getting prefix from the database:
        var pre = await db.get(`prefix_${message.guild.id}`),
            author = await db.get(`c_${message.guild.id}`),
            time = await db.get(`t_${message.guild.id}`);

        // Getting group language from the database
        const lang = await db.get(`${message.guild.id}_langn`);
        var pret = `\`\`${pre}\`\` \n Set by \`\`${author}\`\` \n At <t:${time}>`
        if (pre == null) { var pret = `=(Default)` }
        var msg = `**Info for ${message.guild.name}** \n \n Group Language: \`\`${lang}\`\` \n \n Current prefix: ${pret}`;
        message.reply(msg)
    }
}