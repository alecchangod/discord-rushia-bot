const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/prefix.sqlite" });
const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'setprefix',
    aliases: ['sp'],
    description: 'set prefix/serer',
    run: async (client, message, args, secret, prefix, trans, langc) => {
        // Check if user have permission
        const member = message.guild.members.cache.get(message.author.id)
        if (!member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply('笑死你沒權限');
        // Get prefix provided
        const [, newprefix] = message.content.split(' ');
        // If no prefix provided
        // Return and told them to re-enter
        if (!newprefix) return message.reply('啊到底要設什麽前綴(X')
        // Limit prefic to 5 letter
        if (newprefix.length > 5) return message.reply('前綴太長了w \n 5個字内, 謝謝');
        // Get message information
        const guildId = message.guild.id;
        const author = `${message.author.tag}`;
        // Save the prefix
        await db.set(`prefix_${guildId}`, newprefix);
        console.log(`prefix of ${message.guild.name} has been set to ${newprefix}`)
        // Save the user name which changed the prefix
        await db.set(`c_${guildId}`, author);
        console.log(`prefix of ${message.guild.name}t was set by ${author}`)
        // Save the time for changing it
        const timestamp = Math.floor(Date.now() / 1000);
        await db.set(`t_${guildId}`, timestamp);
        console.log(`prefix of ${message.guild.name}t was set at ${timestamp}`)
        // Check if it was saved
        const prefixFromDb = await db.get(`prefix_${guildId}`);
        console.log(`${message.guild.name}'s newprefix was checked working: \n \n ${prefixFromDb}`)

        const authorFromDb = await db.get(`c_${guildId}`);
        console.log(`${message.guild.name}t was checked set by: \n \n  ${authorFromDb}`)
        
        const timeFromDb = await db.get(`t_${guildId}`);
        console.log(`${message.guild.name}t was checked set by: \n \n  ${timeFromDb}`)
        // Give an reply after runnign the command
        const msg = `current prefix: ${prefixFromDb} \n set by ${authorFromDb} \n in <t:${timeFromDb}>`
        message.reply(msg)
    }
}
