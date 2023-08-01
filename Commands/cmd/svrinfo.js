const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });
const lang = require("../../lang.json")

module.exports = {
    name: 'Server Info',
    aliases: ['svrinfo'],
    description: 'Get server info',
    run: async (client, message, args, secret, prefix, trans) => {
        // Set message.guild.id into a variable to reduce typo
        const guildId = message.guild.id;
        // Getting language information from the database:
        const lang_c = await db.get(`lang_${guildId}`);
        const lang_author = await db.get(`lang_c_${guildId}`);
        const lang_time = await db.get(`lang_t_${guildId}`);
        // Getting prefix information from the database:
        const pre = await db.get(`prefix_${guildId}`);
        const pre_author = await db.get(`prefix_c_${guildId}`);
        const pre_time = await db.get(`prefix_t_${guildId}`);
        // Getting welcome channel from the database
        const channel = await db.get(`welcome_${guildId}`);
        const welcome_author = await db.get(`welcome_c_${guildId}`);
        const welcome_time = await db.get(`welcome_t_${guildId}`);
        // Getting group language from the database
        const set_by = trans.strings.find(it => it.name === "set_by").trans;
        const at = trans.strings.find(it => it.name === "at").trans;
        const using_default = trans.strings.find(it => it.name === "using_default").trans;
        const server_default = trans.strings.find(it => it.name === "server_default").trans;
        const not_set = trans.strings.find(it => it.name === "not_set").trans;
        const info = trans.strings.find(it => it.name === "info").trans;
        const group_lang = trans.strings.find(it => it.name === "group_lang").trans;
        const cur_prefix = trans.strings.find(it => it.name === "cur_prefix").trans;
        const svr_wel_ch = trans.strings.find(it => it.name === "svr_wel_ch").trans;
        let lanh = lang_c ? `\`\`${lang_c}(${lang.filter(it => it.code === lang_c)[0]?.name})\`\` \n${set_by}: <@${lang_author}> \n${at}: <t:${lang_time}>` : `\`\`${message.guild.preferredLocale}(${lang.filter(it => it.code === message.guild.preferredLocale)[0]?.name})\`\` (${server_default})`;
        // Make prefix information into a string
        let pret = pre ? `\`\`${pre}\`\` \n${set_by}: <@${pre_author}> \n${at}: <t:${pre_time}>` : `\`\`=\`\`(${using_default})`;
        // Make welcome channel information into a string
        let wel = channel ? `<#${channel}> \n${set_by}: <@${welcome_author}> \n${at}: <t:${welcome_time}>` : not_set;
        // Make all server information into a strings
        const msg = `**${info} \`\`${message.guild.name}\`\`**\n\n${group_lang}: ${lanh}\n\n${cur_prefix}: ${pret}\n\n${svr_wel_ch}: ${wel}`;
        // Send a reply about the server information
        message.reply(msg);
    }
}
