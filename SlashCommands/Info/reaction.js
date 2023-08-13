const { ApplicationCommandOptionType, AttachmentBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: {
        name: "reaction",
        description: "React to a message",
        options: [
            {
                name: 'add',
                type: ApplicationCommandOptionType.Subcommand,
                description: 'Add an reaction',
                options: [
                    {
                        name: 'reaction',
                        description: 'The emoji to react',
                        type: ApplicationCommandOptionType.String,
                        required: true
                    },
                    {
                        name: 'messageid',
                        description: 'The message to react',
                        type: ApplicationCommandOptionType.String,
                        required: true
                    },
                ],
            },
            {
                name: 'remove',
                type: ApplicationCommandOptionType.Subcommand,
                description: 'Remove an reaction',
                options: [
                    {
                        name: 'reaction',
                        description: 'The emoji to react',
                        type: ApplicationCommandOptionType.String,
                        required: true
                    },
                    {
                        name: 'messageid',
                        description: 'The message to react',
                        type: ApplicationCommandOptionType.String,
                        required: true
                    },
                    {
                        name: 'user',
                        description: 'User to remove',
                        type: ApplicationCommandOptionType.User,
                        required: false
                    },
                ],
            },
        ],
        trans: "reaction",
    },
    async execute(client, interaction, args, secret, trans) {
        if (interaction.user.id != secret.me) return;
        try {
            var reaction = await interaction.options.getString('reaction');
            var messageid = await interaction.options.getString("messageid");
            var status = interaction.options.getSubcommand();

            let emoji = true;
            const reactionid = reaction.includes("<a:") ? reaction.split("<a:")[1].split(":")[1].split(">")[0] : reaction.split("<:")[1].split(":")[1].split(">")[0];
            emoji = client.emojis.cache.get(reactionid);

            const guild = client.guilds.cache.get(interaction.guildId);
            const message = await guild.channels.cache.get(interaction.channelId).messages.fetch(messageid);

            if (status === "add") {
                const no_access = trans.strings.find(it => it.name === "no_access").trans;
                if ((!emoji) && (!message.reactions.cache.find(v => v._emoji.id == reactionid))) return interaction.reply({ content: `${no_access} ${reaction}`, ephemeral: true })
                const sending = trans.strings.find(it => it.name === "sending").trans;
                await interaction.reply({ content: `${sending} ${reaction}`, ephemeral: true, })
                message.react(reaction);
            }
            else {
                const react_not_found = trans.strings.find(it => it.name === "react_not_found").trans;
                if (!message.reactions.cache.find(v => v._emoji.id == reactionid)) return interaction.reply({ content: `${react_not_found} ${reaction}`, ephemeral: true })
                const removing = trans.strings.find(it => it.name === "removing").trans;
                await interaction.reply({ content: `${removing} ${reaction}`, ephemeral: true })
                const member = interaction.options.getMember('user') || secret.bot;
                message.reactions.cache.get(reactionid).users.remove(member);
            }
        } catch (err) {
            console.error(err);
            const error = trans.strings.find(it => it.name === "error").trans;
            await wait(1000);
            await interaction.editReply({ content: `${error}: ${err.message}`, ephemeral: true });
        }
    }
}
