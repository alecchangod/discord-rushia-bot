const { PermissionsBitField, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });

module.exports = {
    data: {
        name: 'command',
        description: 'Ignore chatbox command sent in a channel',
        options: [
            {
                name: 'status',
                type: ApplicationCommandOptionType.String,
                description: 'Enable or disable command in this channel',
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
            // const missing_permission = trans.filter(it => it.name === "bl")[0].lang.filter(it => it.code === langc)[0].strings.filter(it => it.name === "missing_permission")[0].trans;

            if (!user.permissions.has(PermissionsBitField.Flags.ManageMessages) && (interaction.member.id != secret.me)) {
                return interaction.reply("笑死你沒權限 <a:isis:963826754328330300>");
            }

            const status = interaction.options.getString('status');
            const now = await db.get("no_commands");

            if (status === "enable") {

                if (!JSON.stringify(now)?.includes(interaction.channel.id)) {
                    return interaction.reply({ content: "You haven't disbaled chatbox command in this channel yet.", ephemeral: true });
                }

                await db.pull("no_commands", interaction.channel.id);

                interaction.reply({ content: `You have enabled chatbox command. Now all command sent in this channel will not get ignored.`, ephemeral: true });
            }

            else {

                if (JSON.stringify(now)?.includes(interaction.channel.id)) {
                    return interaction.reply({ content: "You have already disabled chstbox command in this channel.", ephemeral: true });
                }

                await db.push("no_commands", interaction.channel.id);

                interaction.reply({ content: `You have disabled chatbox command. Now all command sent in this channel will be ignored.`, ephemeral: true });
            }

        } catch (error) {
            console.error(`Error executing webhook (webhook) command: ${error}`);
        }
    }
};