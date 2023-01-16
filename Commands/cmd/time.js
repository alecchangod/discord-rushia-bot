module.exports = {
  name: "time",
  aliases: ["time"],
  description : 'get current time', 
  run: async (client, message, args, secret, prefix, trans) => {
    var langc = "zh-TW";
    console.log(trans.filter(it => it.name === "time")[0].lang.filter(it => it.code === langc)[0].trans) //.filter(it => it.lang === "en")[0]
    var tt = trans.filter(it => it.name === "time")[0].lang.filter(it => it.code === langc)[0].trans
// const { QuickDB } = require("quick.db");
// const db = new QuickDB({ filePath: "database/track.sqlite" });
//     var mct = message.content
//     var det = mct.split(" ")[1];
//     console.log(det);
//     var grp_id = message.guild.id;
//     console.log(grp_id);
//     var user_name = det;
//     if (message.content.includes('#'))
//       var c_id = message.content.split('#')[1];
//     if (!c_id)
//       var channel_id = message.channelId;
//     else
//       var channel_id = c_id.split('>')[0];
//     console.log(channel_id)
//     var test = client.channels.cache.get(channel_id);
//     if (!test)
//       return message.reply('must provid a valid channel id');
//     if (!message.guild.me.permissionsIn(test).has("SEND_MESSAGES"))
//       return message.reply('please give me send message permission in ' + det[2]);
//     if (!message.guild.me.permissionsIn(test).has("EMBED_LINKS"))
//       return message.reply('please give me embed link permission in ' + det[2]);

//     if ((!user_name) || (user_name.length = 0))
//       return message.reply('must provide a twitte user id to track!');




    message.reply(`${tt}<t:${Math.floor(new Date() / 1000)}>`)
    // console.log(message.guild.preferredLocale)

      // var a = client.channels.cache.get(message.channel.id)
      // console.log(a)
      // if (message.guile.me.permissionsIn(a).has("SEND_MESSAGES")) return message.reply('send message permission')
  }
}