const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/bad_word.sqlite" });

module.exports = {
    name: 'bl',
    description: 'Block words in a group(case sensitive)',
    run: async (client, message, guild, args) => {
        var det = message.content.toLowerCase().split(" "),
            status = det[1],
            word = det[2];
        if (status === "add") {
            (async () => {
                await db.push('group', message.guild.id);
                var now = await db.get(message.guild.id);
                if (JSON.stringify(now).includes(word)) return message.reply("Word already banned.");
                await db.push(`${message.guild.id}`, word);
                message.reply(`\`\`\`${word}\`\`\` was now banned. Try to send it <a:isis:963826754328330300>`);
            })();
        }
        if (status === "del") {
            (async () => {
                var grp = await db.get('group');
                if (JSON.stringify(grp).includes(message.guild.id) === false) return message.reply("No words were banned in this server yet!");
                var now = await db.get(message.guild.id);
                if (JSON.stringify(now).includes(word) === false) return message.reply("Word not yet banned.");
                await db.pull(`${message.guild.id}`, word);
                message.reply(`\`\`\`${word}\`\`\` was now unbanned.`)
            })();
        }
    }
}