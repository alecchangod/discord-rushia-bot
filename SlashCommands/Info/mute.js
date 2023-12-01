const {
  MessageCollector,
  ApplicationCommandOptionType,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: {
    name: "mute",
    description:
      "Auto delete new messages from a specific user in a specific period of time",
    options: [
      {
        name: "target",
        type: ApplicationCommandOptionType.User,
        description: "The user whose messages you want to delete",
        required: true,
      },
      {
        name: "time",
        type: ApplicationCommandOptionType.Integer,
        description: "Time to mute for",
        required: true,
      },
      {
        name: "count",
        type: ApplicationCommandOptionType.Integer,
        description: "Unmute the user after deleting a certain amount of messages (Default to 30)",
        required: false,
      },
    ],
    trans: "mute",
  },
  userPermissions: PermissionsBitField.Flags.ManageMessages,
  async execute(client, interaction, args, secret, trans) {
    const targetUser = interaction.options.getUser("target");
    const deleteCount = interaction.options.getInteger("count") || 30;
    let time = interaction.options.getInteger("time");
    time = time * 60000;

    const user = interaction.member;
    if (
      !user.permissions.has(PermissionsBitField.Flags.ManageMessages) &&
      interaction.member.id != secret.me
    ) {
      const missing_permission = trans.strings.find(
        (it) => it.name === "missing_permission"
      ).trans;
      return interaction.reply(
        `${missing_permission} <a:isis:963826754328330300>`
      );
    }

    // Filter for MessageCollector - only collect messages of target user
    const filter = (m) => m.author.id === targetUser.id;

    // Create a new collector with a time limit of 10 minutes (600000 ms)
    const collector = interaction.channel.createMessageCollector({
      filter,
      max: deleteCount,
      time: time,
    });

    collector.on("end", async (collected) => {
      for (const [, message] of collected) {
        try {
          await message.delete();
        } catch (error) {
          console.error("Failed to delete message: ", error);
        }
      }
    });

    const started = trans.strings.find((it) => it.name === "started").trans;
    const msg = trans.strings.find((it) => it.name === "msg").trans;
    await interaction.reply(
      `${started} ${deleteCount} ${targetUser.tag}${msg}`
    );
  },
};
