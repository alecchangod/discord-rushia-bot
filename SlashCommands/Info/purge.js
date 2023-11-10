const {
  ApplicationCommandOptionType,
  PermissionsBitField,
} = require("discord.js");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
  data: {
    name: "spurge",
    description:
      "Purge messages after a specific message (ONLY less than 14 days)",
    options: [
      {
        name: "messageid",
        type: ApplicationCommandOptionType.String,
        description: "ID of the message after which messages should be purged",
        required: true,
      },
    ],
    trans: "purge",
  },
  async execute(client, interaction, args, secret, trans) {
    try {
      // Check if the interaction author have permission to delete message
      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.ManageMessages
        ) &&
        interaction.member.id != secret.me
      ) {
        const missing_permission = trans.strings.find(
          (it) => it.name === "missing_permission"
        ).trans;
        return interaction.reply(missing_permission);
      }

      // Get message id provided
      const messageId = interaction.options.getString("messageid");

      // Reply first
      const deleting = trans.strings.find(
        (it) => it.name === "deleting_after"
      ).trans;
      await interaction.reply({
        content: `${deleting} https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${messageId}`,
        ephemeral: true,
      });

      let messagesDeleted = 0;
      let fetchedMessages;
      let foundMessage = false;
      let count = 0;

      while (!foundMessage) {
        var limit = 100;
        fetchedMessages = await interaction.channel.messages.fetch({
          limit: limit,
        });
        fetchedMessages.forEach((msg) => {
          if (!foundMessage) {
            if (msg.id === messageId) {
              foundMessage = true;
            } else {
              if (msg.id > messageId) {
                count++;
              }
            }
          }
        });

        while (count >= 100) {
          interaction.channel
            .bulkDelete(fetchedMessages)
            .catch((error) => console.log(error.stack));
          messagesDeleted += 100;
          count = 0;
          break;
        }

        while (count < 100 && count > 1) {
          fetchedMessages = await interaction.channel.messages.fetch({
            limit: count,
          });
          interaction.channel
            .bulkDelete(fetchedMessages)
            .catch((error) => console.log(error.stack));
          messagesDeleted += count;
          count = 0;
          break;
        }

        await wait(1000);
      }

      const msg_del = trans.strings.find((it) => it.name === "msg_del").trans;
      const after_id = trans.strings.find((it) => it.name === "after_id").trans;
      await interaction.editReply(
        `${msg_del} * ${messagesDeleted} ${after_id} https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${messageId} (${messageId}).`
      );
    } catch (error) {
      console.error(`Error executing spurge command: ${error}`);
    }
  },
};
