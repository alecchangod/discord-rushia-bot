const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require("@discordjs/builders")
const { ApplicationCommandOptionType, ButtonStyle, PermissionsBitField } = require("discord.js")
const checkmodperm = require('../../function/slash/checkmodperm.js');
const warnch = require('../../function/slash/warnch.js');

module.exports = {
    data: {
        name: "warn",
        description: "warn user",
        options: [
            {
                name: 'user',
                description: 'User to warn',
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: 'reason',
                description: 'Reason for warning',
                type: ApplicationCommandOptionType.String,
                required: false
            },
            {
                name: 'time',
                description: 'Time in minute to mute (default 5 minutes)',
                type: ApplicationCommandOptionType.Integer,
                required: false,
            },
            {
                name: 'channel',
                description: 'Channel for warning',
                type: ApplicationCommandOptionType.Channel,
                required: false,
            },
        ],
        DefaultPermission: false,
        userPermissions: PermissionsBitField.Flags.ModerateMembers,
    },
    async execute(client, interaction, args, secret, trans, langc, guild) {
        const member = interaction.options.getMember('user');
        await checkmodperm(client, interaction, args, secret, trans, guild, member);

        let time = interaction.options.getInteger('time') || 5;
        member.timeout(1000 * 60 * time);
        const stfu = trans.strings.find(it => it.name === "stfu").trans;
        const min = trans.strings.find(it => it.name === "min").trans;
        interaction.reply(`${member} ${stfu} ${time} ${min} <:bananaV3:958346989597241344>`);

        await warnch(client, interaction, args, secret, trans, guild, member, "warn");
    }
}
