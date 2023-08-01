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
                const no_file = trans.strings.find(it => it.name === "no_file").trans;
                return interaction.reply({
                    content: no_file,
                    ephemeral: true,
                });
            }

            const _wait = trans.strings.find(it => it.name === "wait").trans;
            interaction.reply(_wait);

            const response = await fetch(file.attachment);
            if (!response.ok) throw new Error(`Unexpected response ${response.statusText}`);
            const buffer = await response.buffer();
            const output = await sharp(buffer).png();
            const attach = new AttachmentBuilder(output, { name: 'result.png' });
            const output_file = trans.strings.find(it => it.name === "output_file").trans;
            await wait(1000);
            await interaction.editReply({ content: `${output_file} \`\`.png\`\``,files: [attach] });

        } catch (err) {
            console.error(err);
            await wait(1000);
            const error = trans.strings.find(it => it.name === "error").trans;
            await interaction.editReply(`${error}: ${err.message}`);
        }
    }
}
