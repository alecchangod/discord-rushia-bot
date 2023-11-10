const {
  PermissionsBitField,
  ApplicationCommandOptionType,
  ButtonStyle,
} = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });

module.exports = {
  data: {
    name: "webhook",
    description: "[WIP]Resend all your message as webhook",
    options: [
      {
        name: "status",
        type: ApplicationCommandOptionType.String,
        description: "Add or delete a word",
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
    trans: "webhook",
  },
  async execute(client, interaction, args, secret, trans, langc, guild) {
    try {
      const user = interaction.member;
      const missing_permission = trans.strings.find(
        (it) => it.name === "missing_permission"
      ).trans;

      if (
        !user.permissions.has(PermissionsBitField.Flags.ManageMessages) &&
        interaction.member.id != secret.me
      ) {
        return interaction.reply({
          content: missing_permission,
          ephemeral: true,
        });
      }

      const status = interaction.options.getString("status");
      const now = await db.get(`webhook_${interaction.channel.id}`);

      if (status === "enable") {
        if (now && JSON.stringify(now).includes(interaction.member.id)) {
          const alr_enabled = trans.strings.find(
            (it) => it.name === "alr_enabled"
          ).trans;
          return interaction.reply({ content: alr_enabled, ephemeral: true });
        }

        await db.push(
          `webhook_${interaction.channel.id}`,
          interaction.member.id
        );

        const enabled = trans.strings.find((it) => it.name === "enabled").trans;
        interaction.reply({ content: enabled, ephemeral: true });
      } else {
        if (now && !JSON.stringify(now).includes(interaction.member.id)) {
          const alr_disabled = trans.strings.find(
            (it) => it.name === "alr_disabled"
          ).trans;
          return interaction.reply({ content: alr_disabled, ephemeral: true });
        }

        await db.pull(
          `webhook_${interaction.channel.id}`,
          interaction.member.id
        );

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
