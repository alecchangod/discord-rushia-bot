const { PermissionsBitField, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });

module.exports = {
    data: {
        name: 'webhook',
        description: '[WIP]Resend all your message as webhook',
        options: [
            {
                name: 'status',
                type: ApplicationCommandOptionType.String,
                description: 'Add or delete a word',
                required: true,
                choices: [
                    {
                        name: 'enable',
                        value: 'enable'
                    },
                    {
                        name: 'disable',
                        value: 'disbale'
                    }
                ]
            },

        ],
        userPermissions: PermissionsBitField.Flags.ManageGuild,
    },
    async execute(client, interaction, args, secret, trans, langc, guild) {
        try {
            const user = interaction.member;
            const missing_permission = trans.filter(it => it.name === "bl")[0].lang.filter(it => it.code === langc)[0].strings.filter(it => it.name === "missing_permission")[0].trans || trans.filter(it => it.name === "bl")[0].lang.filter(it => it.code === "en-US")[0].strings.filter(it => it.name === "missing_permission")[0].trans;

            if (!user.permissions.has(PermissionsBitField.Flags.ManageMessages) && (interaction.member.id != secret.me)) {
                return interaction.reply({ content: missing_permission, ephemeral: true });
            }
            console.log("permission pass")

            const status = interaction.options.getString('status');
            const now = await db.get(`webhook_${interaction.channel.id}`);

            if (status === "enable") {

                if ((now) && (JSON.stringify(now).includes(interaction.member.id))) {
                    return interaction.reply({ content: "You already have webhook enabled.", ephemeral: true });
                }

                await db.push(`webhook_${interaction.channel.id}`, interaction.member.id);

                interaction.reply({ content: `You have enabled webhook. Now all your message will be resent as webhook once detected.`, ephemeral: true });
            }

            else {

                if ((now) && (!JSON.stringify(now).includes(interaction.member.id))) {
                    return interaction.reply({ content: "You haven't enabled webhook yet.", ephemeral: true });
                }

                await db.pull(`webhook_${interaction.channel.id}`, interaction.member.id);

                interaction.reply({ content: `You have disabled webhook. Now all your message will not be resent as webhook.`, ephemeral: true });
            }

        } catch (error) {
            console.error(`Error executing webhook (webhook) command: ${error}`);
        }
    }
};