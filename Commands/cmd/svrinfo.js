const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });
const { PermissionsBitField } = require('discord.js');
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
        const lang = await db.get(`${message.guild.id}_lang`);

        if (pre == null) { var pre = `=(Default)` }
        var msg = `**Info for ${message.guild.name}** \n \n Group Language Code: \`\`${lang}\`\` \n \n Current prefix: \`\`${pre}\`\` \n Set by \`\`${author}\`\` \n At <t:${time}>`;
        // console.log(message.member.permissions.has("MANAGE_SERVER"))
        // var perm = message?.member?.permissions?.has("MANAGE_SERVER")
        // console.log(message.member.permissions.cache)
        //     var userMember = await message.guild.members.fetch(message.author)
        //     console.log(userMember.permissions.has(PermissionsBitField.Flags.ManageGuild))
        // if(userMember.permissions.has(PermissionsBitField.Flags.ManageGuild)) 
        // else return message.reply("You don't have permission to change the server language code. Ask help from admin or server owner.");
        message.reply(msg)
    }
}