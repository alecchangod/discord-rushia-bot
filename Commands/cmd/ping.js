module.exports = {
  name: "ping",
  aliases: ["p", "ping"],
  description: 'get your ping',
  run: async (client, message) => {
    var yourping = new Date().getTime() - message.createdTimestamp
    var botping = Math.round(client.ws.ping)

    message.channel.send(`Your ping: ${yourping} \nBots ping: ${botping}`)
  }
}