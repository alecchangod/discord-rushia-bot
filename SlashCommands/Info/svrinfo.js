const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });
module.exports = {
    name: 'svrinfo',
    aliases: ['info', 'server-info'],
    description: 'Get serer info',
    run: async (client, interaction, args, secret, trans) => {

        // Getting prefix from the database
        var pre = await db.get(`prefix_${interaction.guild.id}`),
            author = await db.get(`c_${interaction.guild.id}`),
            time = await db.get(`t_${interaction.guild.id}`);

        // Getting group language from the database
        const lang = await db.get(`${interaction.guild.id}_lang`);

        if (pre == null) { pre = `=(Default)` }
        var msg = `**Info for ${interaction.guild.name}** \n \n Group Language Code: \`\`${lang}\`\` \n \n Current prefix: \`\`${pre}\`\` \n Set by \`\`${author}\`\` \n At <t:${time}>`;
        interaction.reply(msg)
    }
}