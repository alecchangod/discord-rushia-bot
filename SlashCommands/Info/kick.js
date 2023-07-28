const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require("@discordjs/builders")
const { ApplicationCommandOptionType, ButtonStyle, PermissionsBitField } = require("discord.js")
const moment = require("moment");

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
        userPermissions: PermissionsBitField.Flags.ModerateMembers,
    },
    async execute(client, interaction, args, secret, trans, langc, guild) {

        try {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
                return interaction.reply("笑死你沒權限 <a:isis:963826754328330300>");

            if (interaction.user.bot)
                return interaction.reply("你是不會用自己賬號打嗎 <:pekora_whatwrongwithyou:976146270743855217>");

            const member = interaction.options.getMember('user');
            if (!member)
                return interaction.reply("阿你到底要我踢誰 <:cmonBruh:961592205485670420>");

            if (member.user.id === secret.botid)
                return interaction.reply('啊你怎麽那麽厲害可以踢自己 ,我不會欸, 怎麽辦 <a:z_sui_eating:976448366781267998>');

            const reason = interaction.options.getString('reason') || '欸我不知道 <:0V0:970325975810334750>';

            if (member.permissions.has(PermissionsBitField.Flags.Administrator))
                return interaction.reply('管管怎麽踢 <:emoji_34:961594390994882570>');

            // Check if the bot has the required permission
            if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return interaction.reply('你確定要叫一個沒權限的人來幫你?');

            let joinat = `<t:${Math.floor(new Date(member.joinedAt).getTime() / 1000)}>`;
            let leaveat = `<t:${Math.floor(Date.now() / 1000)}>`;
            let warn_channel = interaction.options.getChannel('channel');

            member.kick();

            interaction.reply(`${member} 誰讓你在這裡廢話？滾（X <:bananaV3:958346989597241344> \n\n~~我們不懷念你~~ \n${joinat} ~ ${leaveat}`);

            let str = "```\n"
            str += " _______________________________________\n";
            str += "/                                       \\\n";
            str += "|         In Fucking Memory of          |\n";
            str += "|                                       |\n";
            var uname = member.user.username
            str += `|${' '.repeat(('                                       '.length - uname.length) / 2)}${uname}${' '.repeat((uname.length % 2 === 0 ? ('                                       '.length - uname.length) / 2 + 1 : ('                                       '.length - uname.length) / 2))}|\n`;
            str += "|                                       |\n";
            str += `|          ${moment(member.joinedAt).tz('Asia/Taipei').format("YYYY.MM.DD hh:mm:ss")}          |\n`;
            str += "|                  ~                    |\n";
            str += `|          ${moment(Date.now()).tz('Asia/Taipei').format("YYYY.MM.DD hh:mm:ss")}          |\n`;
            str += "|                                       |\n";
            str += "|                                       |\n";
            str += "|           The Hated member            |\n"
            str += "|                                       |\n"
            str += "|          Never in Our Hearts          |\n"
            str += "|                                       |\n"
            var uname = `Rest In Peace, ${member.user.username}`
            str += `|${' '.repeat(('                                       '.length - uname.length) / 2)}${uname}${' '.repeat((uname.length % 2 === 0 ? ('                                       '.length - uname.length) / 2 + 1 : ('                                       '.length - uname.length) / 2))}|\n`;
            str += "\\_______________________________________/\n";
            str += "                   |\n";
            str += "                   |\n";
            str += "                   |\n";
            str += "                   |\n";
            str += "                   |\n";
            str += "```"

            await interaction.channel.send(str);

            let channel_id = warn_channel ? warn_channel.id : interaction.guild.id === secret.grp ? secret.warn : secret.warn1;

            if (channel_id) {
                const channel = await client.channels.fetch(channel_id);
                channel.send(`**Kickeed**\n人: ${member} <:bananaV3:958346989597241344>\n原因:${reason}`).catch(console.log);
            }
        } catch (e) {
            console.log(e)
        }
    }
}
