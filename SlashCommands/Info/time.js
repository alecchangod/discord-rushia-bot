module.exports = {
  name: "time",
  description: "get current time",
  run: async (client, interaction, args) => {
    var langc = "zh-TW";
    var tt = trans.filter(it => it.name === "time")[0].lang.filter(it => it.code === langc)[0].trans;
    interaction.reply(`${tt}<t:${Math.floor(new Date() / 1000)}>`)
  }
}