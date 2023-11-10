const {
  PermissionsBitField,
  ApplicationCommandOptionType,
  ButtonStyle,
} = require("discord.js");
const bl = require("../../function/common/bl.js");

module.exports = {
  data: {
    name: "blacklist",
    description: "Ban words in a group (case sensitive)",
    options: [
      {
        name: "ban",
        type: ApplicationCommandOptionType.Subcommand,
        description: "Ban a word",
        options: [
          {
            name: "word",
            type: ApplicationCommandOptionType.String,
            description: "The word to ban or unban",
            required: true,
          },
        ],
      },
      {
        name: "unban",
        type: ApplicationCommandOptionType.Subcommand,
        description: "Unban a word",
        options: [
          {
            name: "word",
            type: ApplicationCommandOptionType.String,
            description: "The word to ban or unban",
            required: true,
          },
        ],
      },
      {
        name: "list",
        type: ApplicationCommandOptionType.Subcommand,
        description: "List the word banned",
        options: [],
      },
    ],
    trans: "blacklist",
  },
  async execute(client, interaction, args, secret, trans) {
    try {
      const user = interaction.member;

      const status = interaction.options.getSubcommand();
      const word = interaction.options.getString("word");

      bl(interaction, secret, trans, user, status, word);
    } catch (error) {
      console.error(`Error executing blacklist (bl) command: ${error}`);
    }
  },
};
