module.exports = {
  name: "time",
  aliases: ["time"],
  description: 'get current time',
  run: async (client, message, args, secret, prefix, trans) => {
    var langc = "zh-TW";
    var tt = trans.filter(it => it.name === "time")[0].lang.filter(it => it.code === langc)[0].trans;
    message.reply(`${tt}<t:${Math.floor(new Date() / 1000)}>`)
  }
}