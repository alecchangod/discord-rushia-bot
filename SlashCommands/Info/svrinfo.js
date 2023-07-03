const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });
const lang = require("../../lang.json");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    data: {
        name: "serverinfo",
        description: "Get server info",
    },
    async execute(client, interaction, args, secret, prefix, trans, langc) {
        const guildId = interaction.guild.id;

        const lang_c = await db.get(`lang_${guildId}`);
        const lang_author = await db.get(`lang_c_${guildId}`);
        const lang_time = await db.get(`lang_t_${guildId}`);

        const pre = await db.get(`prefix_${guildId}`);
        const pre_author = await db.get(`prefix_c_${guildId}`);
        const pre_time = await db.get(`prefix_t_${guildId}`);

        const channel = await db.get(`welcome_${guildId}`);
        const welcome_author = await db.get(`welcome_c_${guildId}`);
        const welcome_time = await db.get(`welcome_t_${guildId}`);

        let lanh = lang_c ? `\`\`${lang_c}(${lang.filter(it => it.code === lang_c)[0]?.name})\`\` \n Set by <@${lang_author}> \n At <t:${lang_time}>` : `\`\`${interaction.guild.preferredLocale}(${lang.filter(it => it.code === interaction.guild.preferredLocale)[0]?.name})\`\` (Default)`;
        let pret = pre ? `\`\`${pre}\`\` \n Set by <@${pre_author}> \n At <t:${pre_time}>` : `\`\`=\`\`(Default)`;
        let wel = channel ? `<#${channel}> \n Set by <@${welcome_author}> \n At <t:${welcome_time}>` : `Not set`;

        const msg = `**Info for \`\`${interaction.guild.name}\`\`** \n \n Group Language: ${lanh} \n \n Current prefix: ${pret}\n\n Server welcome channel: ${wel}`;

        interaction.reply(msg);
    }
}