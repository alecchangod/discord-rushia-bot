const { ApplicationCommandOptionType, AttachmentBuilder } = require('discord.js');
const sharp = require('sharp');
const fetch = require('node-fetch');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: {
        name: "converttopng",
        description: "Converts an image to PNG",
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
        try {
            const file = await interaction.options.getAttachment('image');
            console.log(file);

            if (!file) {
                return interaction.reply({
                    content: 'No file was provided!',
                    ephemeral: true,
                });
            }

            interaction.reply("wait...");

            const response = await fetch(file.attachment);
            if (!response.ok) throw new Error(`Unexpected response ${response.statusText}`);
            const buffer = await response.buffer();
            const output = await sharp(buffer).png();
            const attach = new AttachmentBuilder(output, { name: 'result.jpeg' });
            await wait(1000);
            await interaction.editReply({ content: "Output file in \`\`.png\`\`",files: [attach] });

        } catch (err) {
            console.error(err);
            await wait(1000);
            await interaction.editReply(`Couldn't convert the image: ${err.message}`);
        }
    }
}
