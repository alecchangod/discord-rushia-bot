module.exports = {
  data: {
    name: "ping",
    aliases: ["ping"],
    description: 'get your ping',
  },
    async execute(client, interaction, args, secret, trans, langc, guild) {
      // Get ping
      var yourping = new Date().getTime() - interaction.createdTimestamp
      var botping = Math.round(client.ws.ping)
      // Report ping to the user
      interaction.channel.send(`Your ping: ${yourping} \nBots ping: ${botping}`)
    }
  }
  