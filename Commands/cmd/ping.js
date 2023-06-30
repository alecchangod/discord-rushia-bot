module.exports = {
  name: "Ping",
  aliases: ["ping"],
  description: 'get your ping',
  run: async (client, message, args, secret, prefix, trans, langc) => {
    // Get ping
    var yourping = new Date().getTime() - message.createdTimestamp
    var botping = Math.round(client.ws.ping)
    // Report ping to the user
    message.channel.send(`Your ping: ${yourping} \nBots ping: ${botping}`)
  }
}
