const {
  PermissionsBitField,
  ApplicationCommandOptionType,
  ButtonStyle,
} = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });

module.exports = {
  data: {
    name: "command",
    description: "Ignore chatbox command sent in a channel",
    options: [
      {
        name: "status",
        type: ApplicationCommandOptionType.String,
        description: "Enable or disable command in this channel",
        required: true,
        choices: [
          {
            name: "enable",
            value: "enable",
          },
          {
            name: "disable",
            value: "disbale",
          },
        ],
      },
    ],
    trans: "command",
  },
  async execute(client, interaction, args, secret, trans) {
    try {
      const user = interaction.member;
      const missing_permission = trans.strings.find(
        (it) => it.name === "missing_permission"
      ).trans;

      if (
        !user.permissions.has(PermissionsBitField.Flags.ManageMessages) &&
        interaction.member.id != secret.me
      ) {
        return interaction.reply(missing_permission);
      }

      const status = interaction.options.getString("status");
      const now = await db.get("no_commands");

      if (status === "enable") {
        if (!JSON.stringify(now)?.includes(interaction.channel.id)) {
          const alr_enabled = trans.strings.find(
            (it) => it.name === "alr_enabled"
          ).trans;
          return interaction.reply({ content: alr_enabled, ephemeral: true });
        }

        await db.pull("no_commands", interaction.channel.id);
        const enabled = trans.strings.find((it) => it.name === "enabled").trans;

        interaction.reply({ content: enabled, ephemeral: true });
      } else {
        if (JSON.stringify(now)?.includes(interaction.channel.id)) {
          const alr_disabled = trans.strings.find(
            (it) => it.name === "alr_disabled"
          ).trans;
          return interaction.reply({ content: alr_disabled, ephemeral: true });
        }

        await db.push("no_commands", interaction.channel.id);
        const disabled = trans.strings.find(
          (it) => it.name === "disabled"
        ).trans;

        interaction.reply({ content: disabled, ephemeral: true });
      }
    } catch (error) {
      console.error(`Error executing webhook (webhook) command: ${error}`);
    }
  },
};
