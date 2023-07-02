module.exports = {
  data: {
  name: "time",
  description: "get current time",
  },
  async execute(client, interaction, args, secret, trans, langc, guild) {
    var tt = trans.filter(it => it.name === "time")[0].lang.filter(it => it.code === langc)[0].trans;
    interaction.reply(`${tt}<t:${Math.floor(new Date() / 1000)}>`)
  }
}