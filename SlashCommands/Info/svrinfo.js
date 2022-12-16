const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });
module.exports = {
    name: 'svrinfo',
    aliases: ['info', 'server-info'],
    description: 'Get serer info',
    run: async (client, interaction, args, prefix) => {

        // Getting prefix from the database
        const pre = await db.get(`prefix_${interaction.guild.id}`);
        const author = await db.get(`c_${interaction.guild.id}`);
        const time = await db.get(`t_${interaction.guild.id}`);

        // Getting group language from the database
        const lang = await db.get(`${interaction.guild.id}_lang`);

        if (pre == null) { pre = `=(Default)` }
        var msg = `**Info for ${message.guild.name}** \n \n Group Language Code: ${lang} \n \n Current prefix: ${pre} \n Set by ${author} \n At <t:${time}>`;
        interaction.reply(msg)
    }
}