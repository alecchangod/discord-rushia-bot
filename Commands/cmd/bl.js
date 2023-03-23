const { PermissionsBitField } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/bad_word.sqlite" });

module.exports = {
    name: 'bl',
    description: 'Block words in a group(case sensitive)',
    run: async (client, message, args, secret, prefix, trans, langc) => {
        var user = await message.guild.members.fetch(message.author)
        var missing_permission = trans.filter(it => it.name === "bl")[0].lang.filter(it => it.code === langc)[0].strings.filter(it => it.name === "missing_permission")[0].trans;
        if (!user.permissions.has(PermissionsBitField.Flags.ManageMessages)) return message.channel.send(missing_permission) //""
        var det = message.content.toLowerCase().split(" "),
            status = det[1],
            word = det[2];
        if (status === "add") {
            (async () => {
                await db.push('group', message.guild.id);
                var now = await db.get(message.guild.id);
                var already_banned = trans.filter(it => it.name === "bl")[0].lang.filter(it => it.code === langc)[0].strings.filter(it => it.name === "already_banned")[0].trans;
                if (JSON.stringify(now).includes(word)) return message.reply(already_banned);//""
                await db.push(`${message.guild.id}`, word);
                var banned = trans.filter(it => it.name === "bl")[0].lang.filter(it => it.code === langc)[0].strings.filter(it => it.name === "banned")[0].trans;
                message.reply(`\`\`\`${word}\`\`\` ${banned} <a:isis:963826754328330300>`);
            })();
        }
        if (status === "del") {
            (async () => {
                var grp = await db.get('group');
                var no_word_banned = trans.filter(it => it.name === "bl")[0].lang.filter(it => it.code === langc)[0].strings.filter(it => it.name === "no_word_banned")[0].trans;
                if (JSON.stringify(grp).includes(message.guild.id) === false) return message.reply(no_word_banned);
                var now = await db.get(message.guild.id);
                var not_banned = trans.filter(it => it.name === "bl")[0].lang.filter(it => it.code === langc)[0].strings.filter(it => it.name === "not_banned")[0].trans;
                if (JSON.stringify(now).includes(word) === false) return message.reply(not_banned);
                await db.pull(`${message.guild.id}`, word);
                var unbanned = trans.filter(it => it.name === "bl")[0].lang.filter(it => it.code === langc)[0].strings.filter(it => it.name === "unbanned")[0].trans;
                message.reply(`\`\`\`${word}\`\`\` ${unbanned}`)
            })();
        }
    }
}