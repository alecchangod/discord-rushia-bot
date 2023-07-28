const { PermissionsBitField, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/bad_word.sqlite" });

module.exports = {
  data: {
    name: 'blacklist',
    description: 'Ban words in a group (case sensitive)',
    options: [
        {
            name: 'ban',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Ban a word',
            options: [
              {
                name: 'word',
                type: ApplicationCommandOptionType.String,
                description: 'The word to ban or unban',
                required: true,
              },
            ],
          },
          {
            name: 'unban',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Unban a word',
            options: [
              {
                name: 'word',
                type: ApplicationCommandOptionType.String,
                description: 'The word to ban or unban',
                required: true,
              },
            ],
          },
    ],
    userPermissions: PermissionsBitField.Flags.ManageGuild,
},
    async execute(client, interaction, args, secret, trans, langc, guild) {
        try {
            const user = interaction.member;
            const missing_permission = trans.filter(it => it.name === "bl")[0].lang.filter(it => it.code === langc)[0].strings.filter(it => it.name === "missing_permission")[0].trans || trans.filter(it => it.name === "bl")[0].lang.filter(it => it.code === "en-US")[0].strings.filter(it => it.name === "missing_permission")[0].trans;

            if (!user.permissions.has(PermissionsBitField.Flags.ManageMessages) && (interaction.member.id != secret.me)) {
                return interaction.reply(missing_permission);
            }

            const status = interaction.options.getSubcommand();
            const word = interaction.options.getString('word');

            const group = await db.get('group');

            if (status === "ban") {
                if (!JSON.stringify(group).includes(interaction.guild.id)) await db.push('group', interaction.guild.id);
                const now = await db.get(interaction.guild.id);
                const already_banned = trans.filter(it => it.name === "bl")[0].lang.filter(it => it.code === langc)[0].strings.filter(it => it.name === "already_banned")[0].trans;

                if (JSON.stringify(now).includes(word)) {
                    return interaction.reply(already_banned);
                }

                await db.push(`${interaction.guild.id}`, word);
                const banned = trans.filter(it => it.name === "bl")[0].lang.filter(it => it.code === langc)[0].strings.filter(it => it.name === "banned")[0].trans;

                interaction.reply(`\`\`\`${word}\`\`\` ${banned} <a:isis:963826754328330300>`);
            }

            if (status === "unban") {
                const no_word_banned = trans.filter(it => it.name === "bl")[0].lang.filter(it => it.code === langc)[0].strings.filter(it => it.name === "no_word_banned")[0].trans;

                if (!JSON.stringify(group).includes(interaction.guild.id)) {
                    return interaction.reply(no_word_banned);
                }

                const now = await db.get(interaction.guild.id);
                const not_banned = trans.filter(it => it.name === "bl")[0].lang.filter(it => it.code === langc)[0].strings.filter(it => it.name === "not_banned")[0].trans;

                if (!JSON.stringify(now).includes(word)) {
                    return interaction.reply(not_banned);
                }

                await db.pull(`${interaction.guild.id}`, word);
                const unbanned = trans.filter(it => it.name === "bl")[0].lang.filter(it => it.code === langc)[0].strings.filter(it => it.name === "unbanned")[0].trans;

                interaction.reply(`\`\`\`${word}\`\`\` ${unbanned}`);
            }

        } catch (error) {
            console.error(`Error executing blacklist (bl) command: ${error}`);
        }
    }
};