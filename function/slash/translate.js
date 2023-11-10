const { translate } = require("@almeidx/translate");
const lang = require("../../lang.json");
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });

async function slashtranslate(client, interaction, trans) {
  const guildLang = await db.get(`lang_${interaction.guildId}`);
  const text = interaction.options.getString("text");
  const targetLang =
    interaction.options.getString("target_language") ||
    guildLang ||
    interaction.guild.preferredLocale;
  const originalLang =
    interaction.options.getString("original_language") || "auto";

  if (!JSON.stringify(lang).includes(targetLang)) {
    const no_tar = trans.strings.find((it) => it.name === "no_tar").trans;
    return interaction.reply(no_tar);
  }

  if (!JSON.stringify(lang).includes(originalLang) && originalLang !== "auto") {
    const no_ori = trans.strings.find((it) => it.name === "no_ori").trans;
    return interaction.reply(no_ori);
  }

  try {
    const translation = await translate(text, targetLang, originalLang);
    const langc = trans.strings.find((it) => it.name === "langc").trans;
    const trans_text = trans.strings.find(
      (it) => it.name === "trans_text"
    ).trans;
    const trans_provider = trans.strings.find(
      (it) => it.name === "trans_provider"
    ).trans;
    const google_tl = trans.strings.find((it) => it.name === "google_tl").trans;
    interaction.reply(
      `${langc}: ${translation.sourceLang} => ${translation.targetLang}\n${trans_text}: ${translation.translation}\n${trans_provider}: ${google_tl}`
    );
  } catch (error) {
    console.error(`Error executing translation(tl/translate): ${error}`);
  }
}

module.exports = slashtranslate;
