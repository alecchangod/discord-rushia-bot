module.exports = {
  name: "time",
  description: "get current time",
  run: async (client, interaction, args) => {
    var langc = "zh-TW";
    console.log(trans.filter(it => it.name === "time")[0].lang.filter(it => it.code === langc)[0].trans) //.filter(it => it.lang === "en")[0]
    var tt = trans.filter(it => it.name === "time")[0].lang.filter(it => it.code === langc)[0].trans

    interaction.reply(`${tt}<t:${Math.floor(new Date() / 1000)}>`)
    console.log(interaction.guild.preferredLocale)

      // var a = client.channels.cache.get(message.channel.id)
      // console.log(a)
      // if (message.guile.me.permissionsIn(a).has("SEND_MESSAGES")) return message.reply('send message permission')
  }
}