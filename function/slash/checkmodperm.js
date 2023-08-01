const { ApplicationCommandOptionType, ButtonStyle, PermissionsBitField } = require("discord.js")
async function checkmodperm(client, interaction, args, secret, trans, guild, member) {

    const missing_permission = trans.strings.find(it => it.name === "missing_permission").trans;
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers) && (interaction.member.id != secret.me))
        return interaction.reply(`${missing_permission} <a:isis:963826754328330300>`);

    const bot = trans.strings.find(it => it.name === "missing_permission").trans;
    if (interaction.user.bot)
        return interaction.reply(`${bot} <:pekora_whatwrongwithyou:976146270743855217>`);

    const warn_yourself = trans.strings.find(it => it.name === "warn_yourself").trans;
    if (member.user.id === secret.botid)
        return interaction.reply(`${warn_yourself} <a:z_sui_eating:976448366781267998>`);

        const warn_admin = trans.strings.find(it => it.name === "warn_admin").trans;
    if (member.permissions.has(PermissionsBitField.Flags.Administrator))
        return interaction.reply(`${warn_admin} <:emoji_34:961594390994882570>`);

    // Check if the bot has the required permission
        const no_perm = trans.strings.find(it => it.name === "no_perm").trans;
    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return interaction.reply(no_perm);
}

  module.exports = checkmodperm;