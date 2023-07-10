const { ApplicationCommandOptionType, AttachmentBuilder } = require('discord.js');
const fetch = require('node-fetch');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: {
        name: "saypng",
        description: "send an image",
        options: [
            {
                name: 'image',
                description: 'The image to convert',
                type: ApplicationCommandOptionType.Attachment,
                required: true
            },
        ],
    },
    async execute(client, interaction, args, secret, trans, langc, guild) {
        if (interaction.user.id != secret.me) return;
        try {
            var image = await interaction.options.getAttachment('image');

            if (!image) {
                return interaction.reply({
                    content: 'No file was provided!',
                    ephemeral: true,
                });
            }

            var file = await fetch(image.attachment);
            const buffer = await file.buffer();
            const attach = new AttachmentBuilder(buffer);
            await interaction.reply({content: `Sending ${image.name} to current channel.`, ephemeral: true,})
            await interaction.channel.send({ files: [attach] });

        } catch (err) {
            console.error(err);
            await wait(1000);
            await interaction.editReply({ content: `Couldn't convert the image: ${err.message}`, ephemeral: true});
        }
    }
}
