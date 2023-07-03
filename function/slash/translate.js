const { translate } = require("@almeidx/translate");
const lang = require('../../lang.json');
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });

async function slashtranslate(client, interaction, args, secret, trans, langc, guild) {
    const guildLang = await db.get(`lang_${interaction.guildId}`);
    const text = interaction.options.getString('text');
    const targetLang = interaction.options.getString('target_language') || guildLang || interaction.guild.preferredLocale;
    const originalLang = interaction.options.getString('original_language') || "auto";

    if (!JSON.stringify(lang).includes(targetLang)) {
      return interaction.reply("Please enter a valid target language code.");
    }

    if ((!JSON.stringify(lang).includes(originalLang)) && (originalLang !== "auto")) {
      return interaction.reply("Please enter a valid original language code.");
    }

    try {
      const translation = await translate(text, targetLang, originalLang);
      interaction.reply(`Language: ${translation.sourceLang} => ${translation.targetLang}\nTranslation: ${translation.translation}\n||沒錯就是Google渣翻||`);
    } catch (error) {
      console.error(`Error executing translation: ${error}`);
    }
  }

  module.exports = slashtranslate;