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
    const id = interaction.options.getString('messageid');
    if (!id || id.length !== 19) {
        return interaction.reply({ content: `Please enter a valid message id.`, ephemeral: true });
      }
    const msg = await interaction.channel.messages.fetch(id).catch(() => null);
    await msg.delete();

    const user = interaction.member;
    if (!user.permissions.has(PermissionsBitField.Flags.ManageMessages) && (interaction.member.id != secret.me)) {
      return interaction.reply({ content: "笑死你沒權限 <a:isis:963826754328330300>", ephemeral: true });
    }

    await interaction.reply({ content: `Deleted a messages from ${interaction.channel} .`, ephemeral: true });
  }
}