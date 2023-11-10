const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  SelectMenuBuilder,
} = require("@discordjs/builders");
const {
  ApplicationCommandOptionType,
  ButtonStyle,
  Message,
  CommandInteraction,
} = require("discord.js");
const wait = require("node:timers/promises").setTimeout;
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });
const { translate } = require("@almeidx/translate");
const lang = require("../../lang.json");

module.exports = {
  data: {
    name: "setlang",
    description: "Set Group Language",
    options: [
      {
        name: "language",
        type: ApplicationCommandOptionType.String,
        description: "Language code to be set",
        required: true,
      },
    ],
    trans: "set",
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
        const no_perm = trans.strings.find((it) => it.name === "no_perm").trans;
        return interaction.reply(no_perm);
      }

      // Get interaction information
      const guildId = interaction.guildId;
      const author = interaction.user.id;
      // Check if provided language was valid
      const slang = interaction.options.getString("language");
      // If they inputed an invalid language code
      // Return and make them to re-enter a valid code
      const invalid_code = trans.strings.find(
        (it) => it.name === "invalid"
      ).trans;
      if (!lang.some((it) => it.code === slang))
        return interaction.reply({ content: invalid_code, ephemeral: true });
      // If it was valid
      // Save the language code
      await db.set(`lang_${guildId}`, slang);
      // Save the user name which changed the language
      await db.set(`lang_c_${guildId}`, author);
      // Save the time for changing it
      const timestamp = Math.floor(Date.now() / 1000);
      await db.set(`lang_t_${guildId}`, timestamp);
      // Check if it was saved
      const langFromDb = await db.get(`lang_${guildId}`);
      const authorFromDb = await db.get(`lang_c_${guildId}`);
      const timeFromDb = await db.get(`lang_t_${guildId}`);
      const lang_name = lang.filter((it) => it.code === langFromDb)[0]?.name;
      // Give a reply after saving the language code
      const set_to = trans.strings.find((it) => it.name === "set_to").trans;
      const by = trans.strings.find((it) => it.name === "by").trans;
      const at = trans.strings.find((it) => it.name === "at").trans;
      const replyMessage = `${set_to} ${langFromDb} (${lang_name})\n${by}: <@${authorFromDb}>\n${at}: <t:${timeFromDb}>`;

      await interaction.reply(replyMessage);
    } catch (e) {
      console.log(e);
    }
  },
};
