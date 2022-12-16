const { translate } = require("@almeidx/translate");
const lang = require('../../lang.json')
const wait = require('node:timers/promises').setTimeout;
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/lang.sqlite" });

module.exports = {
  name: "tl",
  aliases: ["tl"],
  description : 'translate a message', 
  run: async (client, message, args) => {
    message.reply('loading').then(async (msg) => {
      var trantext = ""
      let text = message.content.split(" ");
      var trantext = text[1];
      var tarlang = text[2];
      var orilang = text[3];
      if ((!tarlang) || (tarlang.length = 0)) var tarlang = await db.get(`${message.guild.id}_lang`);
        await wait(100);
        if ((!orilang) || (orilang.length = 0)) var orilang = "auto";
        if (tarlang === null) var tarlang = "zh-TW";
      if ((!trantext) || (trantext.length = 0)) return msg.delete(), message.reply('must provide text to translate!'), console.log(message, text, trantext);
      if(JSON.stringify(lang).includes(tarlang) === false) return msg.edit("please enter a valid target language code.");
      // if(JSON.stringify(lang).includes(orilang) === false) return msg.edit("please enter a valid language code.");
      const translation = await translate(trantext, tarlang, orilang);
      msg.edit(`語言：${translation.sourceLang} => ${translation.targetLang} \n 譯文： ${translation.translation} \n ||沒錯就是Google渣翻||`)
    }
    )

  }
}
