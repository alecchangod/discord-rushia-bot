const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });

module.exports = {
    name: 'Server Info',
    aliases: ['svrinfo'],
    description: 'Get server info',
    run: async (client, message, args, secret, prefix, trans, langc) => {
        // Getting prefix information from the database:
        const pre = await db.get(`prefix_${message.guild.id}`);
        const author = await db.get(`c_${message.guild.id}`);
        const time = await db.get(`t_${message.guild.id}`);
        // Getting group language from the database
        let lanh = trans.filter(it => it.code === langc)[0]?.name || message.guild.preferredLocale;
        // Make prefix information into a stringS
        let pret = pre ? `\`\`${pre}\`\` \n Set by \`\`${author}\`\` \n At <t:${time}>` : `=(Default)`;
        // Make all server information into a strings
        const msg = `**Info for ${message.guild.name}** \n \n Group Language: \`\`${lanh}\`\` \n \n Current prefix: ${pret}`;
        // Send a reply about the server information
        message.reply(msg);
    }
}
