const { MessageCollector, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');

module.exports = {
  data: {
    name: 'delmsg',
    description: 'Delete a message',
    options: [
      {
        name: 'messageid',
        type: ApplicationCommandOptionType.String,
        description: 'The number of messages to delete',
        required: true,
      },
    ],
  },
  userPermissions: PermissionsBitField.Flags.ManageMessages,
  async execute(client, interaction, args, secret, trans, langc, guild) {
    const user = interaction.member;
    if (!user.permissions.has(PermissionsBitField.Flags.ManageMessages) && (interaction.member.id != secret.me)) {
      const missing_permission = trans.strings.find(it => it.name === "missing_permission").trans;
      return interaction.reply({ content: missing_permission, ephemeral: true });
    }
    const id = interaction.options.getString('messageid');

    const msg = await interaction.channel.messages.fetch(id).catch(() => null);
    if (!msg) {
      const invalid_id = trans.strings.find(it => it.name === "invalid_id").trans;
      return interaction.reply({ content: invalid_id, ephemeral: true });
    }
    await msg.delete();

    const deleted = trans.strings.find(it => it.name === "deleted").trans;
    await interaction.reply({ content: `${deleted} ${interaction.channel} .`, ephemeral: true });
  }
}