const { ApplicationCommandOptionType, PermissionsBitField } = require("discord.js")

module.exports = {
  name: "editmsg",
  description: "edit message sent by bot",
  options: [
    {
      name: 'content',
      description: 'enter the edited message',
      type: ApplicationCommandOptionType.String,
      require: true
    },
    {
      name: 'id',
      description: 'enter message id that you want to edit',
      type: ApplicationCommandOptionType.String,
      require: true
    }
  ],
  userPermissions: PermissionsBitField.Flags.ManageMessages,
  run: async (client, interaction, args, secret, trans, langc, guild) => {
    try {
      const content = interaction.options.getString('content');
      const id = interaction.options.getString('id');
      const channel = await client.channels.fetch(interaction.channelId);

      if (!id || id.length !== 19) {
        return interaction.reply({ content: `Please enter a valid message id.`, ephemeral: true });
      }

      const msg = await channel.messages.fetch(id).catch(() => null);

      if (!msg) {
        return interaction.reply({ content: `Please enter a valid message id.`, ephemeral: true });
      }

      await msg.edit(content);
      interaction.reply({ content: `${content} has been sent to <#${interaction.channelId}>`, ephemeral: true });

    } catch (e) {
      console.log(e)
    }
  }
}
