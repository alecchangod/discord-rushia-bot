const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });
const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'Set Welcome Channel',
    aliases: ['setwelcome'],
    description: 'set welcome channel/serer',
    run: async (client, message, args, secret, prefix, trans) => {
        // Check if user have permission
        const member = message.guild.members.cache.get(message.author.id);
        const missing_permission = trans.strings.find(it => it.name === "missing_permission").trans;
        if (!member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply(missing_permission);
        // Get prefix provided
        let welcome = message.content.split(' ')[1];
        if (welcome.includes("#")) welcome = welcome.split("#")[1].split(">")[0];
        // If no channel provided
        // Return and told them to re-enter
        const no_channel = trans.strings.find(it => it.name === "no_channel").trans;
        if (!welcome) return message.reply(no_channel)
        // Get message information
        const guildId = message.guild.id;
        const author = message.author.id;
        // Save the channel
        await db.set(`welcome_${guildId}`, welcome);
        // Save the user name which changed the prefix
        await db.set(`welcome_c_${guildId}`, author);
        // Save the time for changing it
        const timestamp = Math.floor(Date.now() / 1000);
        await db.set(`welcome_t_${guildId}`, timestamp);

        // Set need_welcome
        const haveenabled = await db.get(`need_welcome`);
        if (!JSON.stringify(haveenabled)?.includes(message.guild.id)) db.push("need_welcome", message.guild.id);

        // Check if it was saved
        const channelFromDb = await db.get(`welcome_${guildId}`);
        const authorFromDb = await db.get(`welcome_c_${guildId}`);
        const timeFromDb = await db.get(`welcome_t_${guildId}`);
        // Give an reply after running the command
        const new_channel = trans.strings.find(it => it.name === "new_channel").trans;
        const set_by = trans.strings.find(it => it.name === "set_by").trans;
        const at = trans.strings.find(it => it.name === "at").trans;
        const msg = `${new_channel}: <#${channelFromDb}> \n${set_by}: <@${authorFromDb}> \n${at}: <t:${timeFromDb}>`
        message.reply(msg);
    }
}
