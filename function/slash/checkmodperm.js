const { ApplicationCommandOptionType, ButtonStyle, PermissionsBitField } = require("discord.js")
async function checkmodperm(client, interaction, args, secret, trans, langc, guild, member) {

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers) && (interaction.member.id != secret.me))
        return interaction.reply("笑死你沒權限 <a:isis:963826754328330300>");

    if (interaction.user.bot)
        return interaction.reply("你是不會用自己賬號打嗎 <:pekora_whatwrongwithyou:976146270743855217>");

    if (!member)
        return interaction.reply("阿你到底要我踢誰 <:cmonBruh:961592205485670420>");

    if (member.user.id === secret.botid)
        return interaction.reply('啊你怎麽那麽厲害可以踢自己 ,我不會欸, 怎麽辦 <a:z_sui_eating:976448366781267998>');

    const reason = interaction.options.getString('reason') || '欸我不知道 <:0V0:970325975810334750>';

    if (member.permissions.has(PermissionsBitField.Flags.Administrator))
        return interaction.reply('管管怎麽踢 <:emoji_34:961594390994882570>');

    // Check if the bot has the required permission
    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return interaction.reply('你確定要叫一個沒權限的人來幫你?');
}

  module.exports = checkmodperm;