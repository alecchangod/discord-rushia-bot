const { ApplicationCommandOptionType, AttachmentBuilder } = require('discord.js');
const fetch = require('node-fetch');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: {
        name: "sayfile",
        description: "send a file",
        options: [
            {
                name: 'file',
                description: 'The file to send',
                type: ApplicationCommandOptionType.Attachment,
                required: true
            },
        ],
    },
    async execute(client, interaction, args, secret, trans, langc, guild) {
        if (interaction.user.id != secret.me) return;
        try {
            var file = await interaction.options.getAttachment('file');

            if (!file) {
                const no_file = trans.strings.find(it => it.name === "no_file").trans;
                return interaction.reply({
                    content: no_file,
                    ephemeral: true,
                });
            }

            var file = await fetch(file.attachment);
            const buffer = await file.buffer();
            const attach = new AttachmentBuilder(buffer);
            const sending = trans.strings.find(it => it.name === "sending").trans;
            const to = trans.strings.find(it => it.name === "to").trans;
            await interaction.reply({content: `${sending} ${file.name} ${to}`, ephemeral: true,})
            await interaction.channel.send({ files: [attach] });

        } catch (err) {
            console.error(err);
            await wait(1000);
            const error = trans.strings.find(it => it.name === "error").trans;
            await interaction.editReply({ content: `${error}: ${err.message}`, ephemeral: true});
        }
    }
}
