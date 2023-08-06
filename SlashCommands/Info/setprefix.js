const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require("@discordjs/builders");
const { ApplicationCommandOptionType, ButtonStyle, PermissionsBitField } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });

module.exports = {
  data: {
    name: "setprefix",
    description: 'Set server prefix',
    options: [
      {
        name: 'new_prefix',
        type: ApplicationCommandOptionType.String,
        description: 'New prefix to be set',
        required: true,
      },
    ],
  },
  userPermissions: PermissionsBitField.Flags.ManageGuild,
  async execute(client, interaction, args, secret, trans, langc, guild) {
    try {
      // Check if the interaction author have permission to delete message
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild) && (interaction.member.id != secret.me)) {
        const missing_permission = trans.strings.find(it => it.name === "missing_permission").trans;
        return interaction.reply(missing_permission);
      }

      // Get prefix provided
      const newprefix = interaction.options.getString('new_prefix');

      // Limit prefic to 5 letter
      const tooooo_long = trans.strings.find(it => it.name === "tooooo_long").trans;
      if (newprefix.length > 5) return message.reply(tooooo_long);

      // Get interaction information
      const guildId = interaction.guildId;
      const author = interaction.user.id;

      // Save the prefix
      await db.set(`prefix_${guildId}`, newprefix);
      // Save the user name which changed the prefix
      await db.set(`prefix_c_${guildId}`, author);

      // Save the time for changing it
      const timestamp = Math.floor(Date.now() / 1000);
      await db.set(`prefix_t_${guildId}`, timestamp);

      // Check if it was saved
      const prefixFromDb = await db.get(`prefix_${guildId}`);
      const authorFromDb = await db.get(`prefix_c_${guildId}`);
      const timeFromDb = await db.get(`prefix_t_${guildId}`);

      // Give an reply after running the command
      const new_prefix = trans.strings.find(it => it.name === "new_prefix").trans;
      const set_by = trans.strings.find(it => it.name === "set_by").trans;
      const at = trans.strings.find(it => it.name === "at").trans;
      const msg = `${new_prefix}: ${prefixFromDb}\n${set_by}: <@${authorFromDb}>\n${at}: <t:${timeFromDb}>`
      interaction.reply(msg);

    } catch (e) {
      console.log(e);
    }
  },
};