const { PermissionsBitField } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/bad_word.sqlite" });
const split = require("./split.js");

async function bl(interaction, secret, trans, user, status, word) {
    // Get translation
    const missing_permission = trans.strings.find(it => it.name === "missing_permission").trans;
    const invalid_status = trans.strings.find(it => it.name === "invalid_status").trans;
    const already_banned = trans.strings.find(it => it.name === "already_banned").trans;
    const banned = trans.strings.find(it => it.name === "banned").trans;
    const no_word_banned = trans.strings.find(it => it.name === "no_word_banned").trans;
    const not_banned = trans.strings.find(it => it.name === "not_banned").trans;
    const unbanned = trans.strings.find(it => it.name === "unbanned").trans;
    const list_of_word_banned = trans.strings.find(it => it.name === "list_of_word_banned").trans;
    const sending_list_of_word_banned = trans.strings.find(it => it.name === "sending_list_of_word_banned").trans;

    if (!user.permissions.has(PermissionsBitField.Flags.ManageMessages) && (interaction.member.id != secret.me)) {
        return interaction.reply(missing_permission);
    }


    const group = await db.get('group');
    const now = await db.get(interaction.guild.id);

    if (status === "ban") {
        if (!JSON.stringify(group).includes(interaction.guild.id)) await db.push('group', interaction.guild.id);

        if (JSON.stringify(now).includes(word)) {
            return interaction.reply(already_banned);
        }

        await db.push(`${interaction.guild.id}`, word);

        interaction.reply(`\`\`\`${word}\`\`\` ${banned} <a:isis:963826754328330300>`);
    }

    else if (status === "unban") {

        if (!JSON.stringify(group).includes(interaction.guild.id)) {
            return interaction.reply(no_word_banned);
        }

        if (!JSON.stringify(now).includes(word)) {
            return interaction.reply(not_banned);
        }

        await db.pull(`${interaction.guild.id}`, word);

        interaction.reply(`\`\`\`${word}\`\`\` ${unbanned}`);
    }

    else if (status === "list") {

        if (!JSON.stringify(group).includes(interaction.guild.id)) {
            return interaction.reply(no_word_banned);
        }

        // Get the list of blocked words for this guild
        var blocked = await db.get(`${interaction.guild.id}`);

        // Show the list of blocked words
        let list = list_of_word_banned;
        blocked.forEach(word => {
            list += `\`\`\`${word}\`\`\`\n`
        });

        interaction.reply(sending_list_of_word_banned);

        split(list, interaction.channel);
    }

    else return interaction.reply(invalid_status)

};

module.exports = bl;