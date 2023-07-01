const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });
const lang = require("../../lang.json")

module.exports = {
    name: 'Server Info',
    aliases: ['svrinfo'],
    description: 'Get server info',
    run: async (client, message, args, secret, prefix, trans, langc) => {
        // Set message.guild.id into a variable to reduce typo
        const guildId = message.guild.id;
        // Getting prefix information from the database:
        const pre = await db.get(`prefix_${guildId}`);
        const author = await db.get(`prefix_c_${guildId}`);
        const time = await db.get(`prefix_t_${guildId}`);
        // Getting welcome channel from the database
        const channel = await db.get(`welcome_${guildId}`);
        const welcome_author = await db.get(`welcome_c_${guildId}`);
        const welcome_time = await db.get(`welcome_t_${guildId}`);
        // Getting group language from the database
        let lanh = `${langc}(${lang.filter(it => it.code === langc)[0]?.name})` || message.guild.preferredLocale;
        // Make prefix information into a string
        let pret = pre ? `\`\`${pre}\`\` \n Set by <@${author}> \n At <t:${time}>` : `\`\`=\`\`(Default)`;
        // Make welcome channel information into a string
        let wel = channel ? `<#${channel}> \n Set by <@${welcome_author}> \n At <t:${welcome_time}>` : `Not set`;
        // Make all server information into a strings
        const msg = `**Info for \`\`${message.guild.name}\`\`** \n \n Group Language: \`\`${lanh}\`\` \n \n Current prefix: ${pret}\n\n Server welcome channel: ${wel}`;
        // Send a reply about the server information
        message.reply(msg);
    }
}
