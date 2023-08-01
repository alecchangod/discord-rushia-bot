const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });
const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'Set Prefix',
    aliases: ['setprefix'],
    description: 'set prefix/serer',
    run: async (client, message, args, secret, prefix, trans, langc) => {
        // Check if user have permission
        const member = message.guild.members.cache.get(message.author.id)
        const missing_permission = trans.strings.find(it => it.name === "missing_permission").trans;
        if (!member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply(missing_permission);
        // Get prefix provided
        const [, newprefix] = message.content.split(' ');
        // If no prefix provided
        // Return and told them to re-enter
        const no_prefix = trans.strings.find(it => it.name === "no_prefix").trans;
        if (!newprefix) return message.reply(no_prefix);
        // Limit prefic to 5 letter
        const tooooo_long = trans.strings.find(it => it.name === "tooooo_long").trans;
        if (newprefix.length > 5) return message.reply(tooooo_long);
        // Get message information
        const guildId = message.guild.id;
        const author = message.author.id;
        // Save the prefix
        await db.set(`prefix_${guildId}`, newprefix);
        // Save the user name which changed the prefix
        await db.set(`prefix_c_${guildId}`, author);
        // Save the time for changing it
        const timestamp = Math.floor(Date.now() / 1000);
        await db.set(`prefix_t_${guildId}`, timestamp);
        // Check if it was saved
        const prefixFromDb = await db.get(`prefix_${guildId}`);
        const authorFromDb = await db.get(`prefix_c_${guildId}`);
        const timeFromDb = await db.get(`prefix_t_${guildId}`);
        // Give an reply after running the command
        const new_prefix = trans.strings.find(it => it.name === "new_prefix").trans;
        const set_by = trans.strings.find(it => it.name === "set_by").trans;
        const at = trans.strings.find(it => it.name === "at").trans;
        const msg = `${new_prefix}: ${prefixFromDb}\n${set_by}: <@${authorFromDb}>\n${at}: <t:${timeFromDb}>`
        message.reply(msg);
    }
}
