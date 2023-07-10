const { ApplicationCommandOptionType, AttachmentBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: {
        name: "reaction",
        description: "React to a message",
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
    async execute(client, interaction, args, secret, trans, langc, guild) {
        if (interaction.user.id != secret.me) return;
        try {
            var reaction = await interaction.options.getString('reaction');
            var messageid = await interaction.options.getString("messageid");
            await interaction.reply({ content: `Sending ${reaction}`, ephemeral: true, })
            const guild = client.guilds.cache.get(interaction.guildId);
            const message = await guild.channels.cache.get(interaction.channelId).messages.fetch(messageid);
            message.react(reaction);

        } catch (err) {
            console.error(err);
            await wait(1000);
            await interaction.editReply({ content: `Couldn't send the reaction: ${err.message}`, ephemeral: true });
        }
    }
}
