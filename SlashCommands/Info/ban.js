const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require("@discordjs/builders")
const { ApplicationCommandOptionType, ButtonStyle, PermissionsBitField } = require("discord.js")
const checkmodperm = require('../../function/slash/checkmodperm.js');
const tombstonegen = require('../../function/slash/tombstonegen.js');
const byeuser = require('../../function/slash/byeuser.js');
const warnch = require('../../function/slash/warnch.js');

module.exports = {
    data: {
        name: "ban",
        description: "ban user",
        options: [
            {
                name: 'user',
                description: 'User to ban',
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: 'reason',
                description: 'Reason for banning',
                type: ApplicationCommandOptionType.String,
                required: false
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

        await byeuser(client, interaction, args, secret, trans, guild, member, "ban");

        await tombstonegen(client, interaction, args, secret, trans, guild, member);

        await warnch(client, interaction, args, secret, trans, guild, member, "ban");
    }
}
