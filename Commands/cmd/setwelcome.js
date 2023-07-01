const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/welcome.sqlite" });
const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'Set Welcome Channel',
    aliases: ['setwelcome'],
    description: 'set welcome channel/serer',
    run: async (client, message, args, secret, prefix, trans, langc) => {
        // Check if user have permission
        const member = message.guild.members.cache.get(message.author.id)
        if (!member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply('笑死你沒權限');
        // Get prefix provided
        let welcome = message.content.split(' ')[1];
        if (welcome.includes("#")) welcome = welcome.split("#")[1].split(">")[0];
        // If no channel provided
        // Return and told them to re-enter
        if (!welcome) return message.reply('啊到底要設什麽(X')
        // Get message information
        const guildId = message.guild.id;
        const author = `${message.author.tag}`;
        // Save the channel
        await db.set(`welcome_${guildId}`, welcome);
        // Save the user name which changed the prefix
        await db.set(`c_${guildId}`, author);
        // Save the time for changing it
        const timestamp = Math.floor(Date.now() / 1000);
        await db.set(`t_${guildId}`, timestamp);
        // Check if it was saved
        const channelFromDb = await db.get(`welcome_${guildId}`);
        const authorFromDb = await db.get(`c_${guildId}`);
        const timeFromDb = await db.get(`t_${guildId}`);
        // Give an reply after runnign the command
        const msg = `New welcome channel: ${prefixFromDb} \n set by ${authorFromDb} \n at <t:${timeFromDb}>`
        message.reply(msg);
    }
}
