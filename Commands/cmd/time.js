module.exports = {
  name: "time",
  aliases: ["time"],
  description: 'get current time',
  run: async (client, message, args, secret, prefix, trans, langc) => {
    // var langc = "zh-TW";
    console.log(langc);
    var current_time = trans.filter(it => it.name === "time")[0].lang.filter(it => it.code === langc)[0].strings.filter(it => it.name === "current_time")[0].trans;
    message.reply(`${current_time}<t:${Math.floor(new Date() / 1000)}>`)
  }
}