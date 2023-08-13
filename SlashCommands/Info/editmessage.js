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
    trans: "editmessage",
  },
  async execute(client, interaction, args, secret, trans) {
    try {

      const user = interaction.member;
      if (!user.permissions.has(PermissionsBitField.Flags.ManageMessages) && (interaction.member.id != secret.me)) {
        const missing_permission = trans.strings.find(it => it.name === "missing_permission").trans;
        return interaction.reply(missing_permission);
      }

      const content = interaction.options.getString('content');
      const id = interaction.options.getString('id');
      const channel = await client.channels.fetch(interaction.channelId);
      const isWebhook = interaction.options.get("iswebhook");
      if (isWebhook) {
        // Find webhook that the bot can use
        const webhookClient = await interaction.channel.fetchWebhooks();
        var webhook = webhookClient.find(wh => wh.token);

        if (!webhook) {
          var webhook = await interaction.channel.createWebhook({
            name: 'Rushia'
          });
        }
        // Edit the message
        await webhook.editMessage(id, { content: content });
      }
      else {
        const msg = await channel.messages.fetch(id).catch(() => null);
        if (!msg) {
          const invalid_msg = trans.strings.find(it => it.name === "invalid_msg").trans;
          return interaction.reply({ content: invalid_msg, ephemeral: true });
        }

        if (msg.author.id != secret.botid) {
          const not_mine = trans.strings.find(it => it.name === "not_mine").trans;
          return interaction.reply({ content: not_mine, ephemeral: true });
        }

        await msg.edit(content);
      }
      const sent = trans.strings.find(it => it.name === "sent").trans;
      interaction.reply({ content: `${content} ${sent} <#${interaction.channelId}>`, ephemeral: true });

    } catch (e) {
      console.log(e)
    }
  }
}
