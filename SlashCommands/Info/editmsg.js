const { ApplicationCommandOptionType, PermissionsBitField } = require("discord.js")

module.exports = {
  data: {
    name: "editmessage",
    description: "edit message sent by bot or by using webhook",
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
      },
      {
        name: 'iswebhook',
        description: 'enter message id that you want to edit',
        type: ApplicationCommandOptionType.Boolean,
        require: false
      }
    ],
    userPermissions: PermissionsBitField.Flags.ManageMessages,
  },
  async execute(client, interaction, args, secret, trans, langc, guild) {
    try {

      const content = interaction.options.getString('content');
      const id = interaction.options.getString('id');
      const channel = await client.channels.fetch(interaction.channelId);
      const isWebhook = interaction.options.get("iswebhook");
      if (isWebhook) {
        // Find webhook that the bot can use
        const webhookClient = await interaction.channel.fetchWebhooks();
        var webhook = webhookClient.find(wh => wh.token);

        if (!webhook) {
          console.log('No webhook was found that I can use!');
          console.log("Now I'll create a new one.")
          var webhook = await interaction.channel.createWebhook({
            name: 'Rushia'
          });
        }
        // Edit the message
        const editedMessage = await webhook.editMessage(id, { content: content });
        console.log("Edited webhook message: ", editedMessage)
      }
      else {
        if (!id || id.length !== 19) {
          return interaction.reply({ content: `Please enter a valid message id.`, ephemeral: true });
        }

        const msg = await channel.messages.fetch(id).catch(() => null);

        if (!msg) {
          return interaction.reply({ content: `Please enter a valid message id.`, ephemeral: true });
        }

        if (msg.author.id != secret.botid) {
          return interaction.reply({ content: `I cannot edit a message sent by others.`, ephemeral: true });
        }

        await msg.edit(content);
      }
      interaction.reply({ content: `${content} has been sent to <#${interaction.channelId}>`, ephemeral: true });

    } catch (e) {
      console.log(e)
    }
  }
}
