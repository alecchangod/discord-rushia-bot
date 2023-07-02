const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });
const lang = require('../../lang.json');
module.exports = {
  data: {
    name: 'svrinfo',
    aliases: ['info', 'server-info'],
    description: 'Get serer info',
  },
    async execute(client, interaction, args, secret, trans, langc, guild) {
        // Getting prefix from the database:
        var pre = await db.get(`prefix_${interaction.guild.id}`),
            author = await db.get(`c_${interaction.guild.id}`),
            time = await db.get(`t_${interaction.guild.id}`);

        // Getting group language from the database
        var lanh = lang.filter(it => it.code === langc)[0]?.name;
        if (lanh == undefined) var lanh = interaction.guild.preferredLocale;
        var pret = `\`\`${pre}\`\` \n Set by \`\`${author}\`\` \n At <t:${time}>`
        if (pre == null) { var pret = `=(Default)` }
        var msg = `**Info for ${interaction.guild.name}** \n \n Group Language: \`\`${lanh}\`\` \n \n Current prefix: ${pret}`;
        interaction.reply(msg)
    }
}