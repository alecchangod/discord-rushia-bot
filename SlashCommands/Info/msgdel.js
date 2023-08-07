const { PermissionsBitField, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  data: {
    name: "msgdel",
    description: 'purge message to delete (ONLY less than 14 days)',
    options: [
      {
        name: 'amount',
        type: ApplicationCommandOptionType.Integer,
        description: 'The number of messages to delete',
        required: true
      }
    ],
    userPermissions: PermissionsBitField.Flags.ManageMessages,
  },
  async execute(client, interaction, args, secret, trans, langc, guild) {
    try {
      const user = interaction.member;
      // Check if user has permission to delete message
      if (!user.permissions.has(PermissionsBitField.Flags.ManageMessages) && (interaction.member.id != secret.me)) {
        const missing_permission = trans.strings.find(it => it.name === "missing_permission").trans;
        return interaction.reply(missing_permission);
      }

      // Get amount to delete from interaction
      let amount = interaction.options.getInteger('amount');

      // Reply first
      const deleting = trans.strings.find(it => it.name === "deleting").trans;
      await interaction.reply({content: `${deleting} * ${amount} .`, ephemeral: true})

      // Start counting
      let messagesDeleted = 0;
      let fetchedMessages;

      do {
        fetchedMessages = await interaction.channel.messages.fetch({ limit: Math.min(amount, 100) });
        interaction.channel.bulkDelete(fetchedMessages).catch(error => console.log(error.stack));
        messagesDeleted += fetchedMessages.size;
        amount -= fetchedMessages.size;
      } while (amount > 0);

      // Give a reply after deleting required message
        const msg_del = trans.strings.find(it => it.name === "msg_del").trans;
      await interaction.editReply(`<@${interaction.user.id}> ${msg_del} ${messagesDeleted} .`);

    } catch (error) {
      console.error(`Error executing purge(msgdel) command: ${error}`);
    }
  }
};
