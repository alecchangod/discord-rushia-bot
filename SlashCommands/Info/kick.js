const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require("@discordjs/builders")
const { ApplicationCommandOptionType, ButtonStyle, PermissionsBitField } = require("discord.js")
const checkmodperm = require('../../function/slash/checkmodperm.js');
const tombstonegen = require('../../function/slash/tombstonegen.js');
const byeuser = require('../../function/slash/byeuser.js');
const warnch = require('../../function/slash/warnch.js');

module.exports = {
    data: {
        name: "kick",
        description: "kick user",
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
        trans: "moderate",
    },
    async execute(client, interaction, args, secret, trans) {
        const member = interaction.options.getMember('user');

        let status = await checkmodperm(client, interaction, secret, trans, member);
        if (!status) return;

        await byeuser(client, interaction, secret, trans, member, "kick");

        await tombstonegen(client, interaction, trans, member);

        await warnch(client, interaction, trans, member, "kick");
    }
}
