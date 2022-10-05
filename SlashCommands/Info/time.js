module.exports = {
  name: "time",
  description: "get current time",
  run: async (client, interaction, args) => {

    interaction.reply(`<t:${Math.floor(new Date() / 1000)}>`)
    console.log(interaction.guild.preferredLocale)

      // var a = client.channels.cache.get(message.channel.id)
      // console.log(a)
      // if (message.guile.me.permissionsIn(a).has("SEND_MESSAGES")) return message.reply('send message permission')
  }
}