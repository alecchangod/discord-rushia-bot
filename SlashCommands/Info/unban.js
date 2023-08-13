const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require("@discordjs/builders")
const { ApplicationCommandOptionType, ButtonStyle, PermissionsBitField } = require("discord.js")
const warnch = require('../../function/slash/warnch.js');

module.exports = {
    data: {
        name: "unban",
        description: "unban user",
        options: [
            {
                name: 'userid',
                description: "User's ID to unban",
                type: ApplicationCommandOptionType.String,
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
    async execute(client, interaction, args, secret, trans) {
        const member = interaction.options.getString('userid');

        // Check for user permission
        const missing_permission = trans.strings.find(it => it.name === "missing_permission").trans;
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers) && (interaction.member.id != secret.me))
            return interaction.reply(`${missing_permission} <a:isis:963826754328330300>`);

        // Return if using bot account
        const bot = trans.strings.find(it => it.name === "bot").trans;
        if (interaction.user.bot)
            return interaction.reply(`${bot} <:pekora_whatwrongwithyou:976146270743855217>`);

        // Check if the user was banned
        const not_banned = trans.strings.find(it => it.name === "not_banned").trans;
        const banList = await interaction.guild.bans.fetch();
        const bannedUser = banList.find((user) => user.id === member);
        if (!bannedUser) return interaction.reply(`<@${member}> ${not_banned}`)

        // Check if the bot has the required permission
            const no_perm = trans.strings.find(it => it.name === "no_perm").trans;
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return interaction.reply(no_perm);

        // Unban the user
        const fine = trans.strings.find(it => it.name === "fine").trans;
        const join_again = trans.strings.find(it => it.name === "join_again").trans;
        message.guild.members.unban(member);
        interaction.reply(`${fine} <@${member}> ${join_again}`);

        await warnch(client, interaction, trans, `<@${member}>`, "unban");
    }
}
