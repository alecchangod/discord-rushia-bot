const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require("@discordjs/builders")
const { ApplicationCommandOptionType, ButtonStyle, PermissionsBitField } = require("discord.js")

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
        try {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers) && (interaction.member.id != secret.me))
                return interaction.reply("笑死你沒權限 <a:isis:963826754328330300>");

            if (interaction.user.bot)
                return interaction.reply("你是不會用自己賬號打嗎 <:pekora_whatwrongwithyou:976146270743855217>");

            const member = interaction.options.getMember('user');
            if (!member)
                return interaction.reply("阿你到底要我禁誰 <:cmonBruh:961592205485670420>");

            if (member.user.id === secret.botid)
                return interaction.reply('啊你怎麽那麽厲害可以禁言自己 ,我不會欸, 怎麽辦 <a:z_sui_eating:976448366781267998>');

            const reason = interaction.options.getString('reason') || '欸我不知道 <:0V0:970325975810334750>';

            if (member.permissions.has(PermissionsBitField.Flags.Administrator))
                return interaction.reply('管管怎麽禁言 <:emoji_34:961594390994882570>');

            // Check if the bot has the required permission
            if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return interaction.reply('你確定要叫一個沒權限禁言的人來幫你?');

            let time = interaction.options.getInteger('time') || 5;
            let warn_channel = interaction.options.getChannel('channel');

            member.timeout(1000 * 60 * time);

            interaction.reply(`${member} 誰讓你在這裡廢話？滾, ${time} 分鐘後再回來（X <:bananaV3:958346989597241344>`);

            let channel_id = warn_channel ? warn_channel.id : interaction.guild.id === secret.grp ? secret.warn : secret.grp1 ? secret.warn1 : null;
            if (!channel_id) return;

            if (channel_id) {
                const channel = await client.channels.fetch(channel_id);
                channel.send(`**Timeout**\n人: ${member} <:bananaV3:958346989597241344>\n原因:${reason}\n時間: ${time}分鐘`).catch(console.log);
            }
        } catch (e) {
            console.log(e)
        }
    }
}
