module.exports = {
    name: "tl", 
    aliases: ["t"],
    run: async(client, message, args, prefix) => { 
        const translate = require('@vitalets/google-translate-api');
        message.reply('loading').then((msg) => {
        var trantext = ""
        let text = message.content.split(`${prefix}tl`);
        var trantext = text[1];
        if((!trantext) || (trantext.length = 0)) return msg.delete(), message.reply('must provide text to translate!');
        translate(trantext, { to: 'zh-TW' }).then(res => {
          msg.edit(`原語言：${res.from.language.iso} \n 譯文： ${res.text} \n ||沒錯就是Google渣翻||`)
        }).catch(err => {
          console.error(err);
        }) 
    }
        )
         
  }
}