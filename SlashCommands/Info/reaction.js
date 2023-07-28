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
                description: 'Ban a word',
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
                description: 'Unban a word',
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
    },
    async execute(client, interaction, args, secret, trans, langc, guild) {
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
                if ((!emoji) && (!message.reactions.cache.find(v => v._emoji.id == reactionid))) return interaction.reply({ content: `I don't have access to ${reaction}`, ephemeral: true })
                await interaction.reply({ content: `Sending ${reaction}`, ephemeral: true, })
                message.react(reaction);
            }
            else {
                if ((!emoji) && (!message.reactions.cache.find(v => v._emoji.id == reactionid))) return interaction.reply({ content: `I don't have access to ${reaction}`, ephemeral: true })
                await interaction.reply({ content: `Removing ${reaction}`, ephemeral: true })
                const member = interaction.options.getMember('user') || secret.bot;
                message.reactions.cache.get(reactionid).users.remove(member);
            }
        } catch (err) {
            console.error(err);
            await wait(1000);
            await interaction.editReply({ content: `Couldn't send the reaction: ${err.message}`, ephemeral: true });
        }
    }
}
