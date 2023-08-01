const { translate } = require("@almeidx/translate");
const lang = require('../../lang.json');
const wait = require('node:timers/promises').setTimeout;
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });

module.exports = {
  name: "Translate",
  aliases: ["tl"],
  description: 'translate a message',
  run: async (client, message, args, secret, prefix, trans) => {
    let svr_lang = await db.get(`lang_${message.guild.id}`);
    var hastarlangInput = true, hasorilangInput = true;
    try {
      // Send a "loading" first
    const loading = trans.strings.find(it => it.name === "loading").trans;
      const msg = await message.reply(loading);
      // Get input from message
      var trantext = message.content.substring(3);
      let tarlangInput, orilangInput;
      if (message.content.includes("tar:")) {
        if (message.content.includes("ori:")) {
          tarlangInput = message.content.split("tar:")[1].split(" ")[1].split(" ori:")[0];
          orilangInput = message.content.split("ori:")[1].split(" ")[1].split(" ")[0];
          // trantext = trantext.split(`tar: ${tarlangInput}`)[0];
        }
        else tarlangInput = message.content.split("tar: ")[1];

        var trantext = trantext.split(`tar: ${tarlangInput}`)[0];
      }
      // Use Server language as target if nothing provided
      if(!tarlangInput) hastarlangInput = false;
      let tarlang = hastarlangInput ? tarlangInput : svr_lang || message.guild.preferredLocale;
      // Auto detect the original language if not provided 
      if(!orilangInput) hasorilangInput = false;
      let orilang = hasorilangInput ? orilangInput : "auto";
      // Wait 100ms to make sure the "loading" have been sent
      await wait(100);
      // If no content provided for translate
      // Delete the loading message and told them to provide text to translate
      if (!trantext) {
        const no_text = trans.strings.find(it => it.name === "no_text").trans;
        await msg.delete();
        return message.reply(no_text);
      }
      // If the language was invalid
      // Ask them to re-enter
      if (!JSON.stringify(lang).includes(tarlang)) {
        const no_tar = trans.strings.find(it => it.name === "no_tar").trans;
        return msg.edit(no_tar);
      }
      if ((!JSON.stringify(lang).includes(orilang)) && (orilang !== "auto")) {
        const no_ori = trans.strings.find(it => it.name === "no_ori").trans;
        return msg.edit(no_ori);
      }
      // Start doing translation
      const translation = await translate(trantext, tarlang, orilang);
      // Edit the "loading" message after translate done
        const langc = trans.strings.find(it => it.name === "langc").trans;
        const trans_text = trans.strings.find(it => it.name === "trans_text").trans;
        const trans_provider = trans.strings.find(it => it.name === "trans_provider").trans;
        const google_tl = trans.strings.find(it => it.name === "google_tl").trans;
      msg.edit(`${langc}: ${translation.sourceLang} => ${translation.targetLang}\n${trans_text}: ${translation.translation}\n${trans_provider}: ${google_tl}`);
    } catch (error) {
      console.error(`Error executing translation: ${error}`);
    }
  }
};
