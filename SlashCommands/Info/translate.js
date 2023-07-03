const { ApplicationCommandOptionType } = require("discord.js");
const slashtranslate = require('../../function/slash/translate.js');

module.exports = {
  data: {
    name: "translate",
    description: "Translate a message",
    options: [
      {
        name: 'text',
        description: 'Text to translate',
        type: ApplicationCommandOptionType.String,
        required: true
      },
      {
        name: 'target_language',
        description: 'Code of the target language',
        type: ApplicationCommandOptionType.String,
        required: false
      },
      {
        name: 'original_language',
        description: 'Code of the original language',
        type: ApplicationCommandOptionType.String,
        required: false
      }
    ]
  },
  async execute(client, interaction, args, secret, trans, langc, guild) {
    await slashtranslate(client, interaction, args, secret, trans, langc, guild);
  }
};