module.exports = {
  data: {
    name: "ping",
    aliases: ["ping"],
    description: 'get your ping',
    trans: "ping",
  },
  async execute(client, interaction, args, secret, trans) {
    // Get ping
    var yourping = new Date().getTime() - interaction.createdTimestamp
    var botping = Math.round(client.ws.ping)
    // Report ping to the user
    const your_ping = trans.strings.find(it => it.name === "your_ping").trans;
    const bot_ping = trans.strings.find(it => it.name === "bot_ping").trans;
    interaction.reply(`${your_ping}: ${yourping} \n${bot_ping}: ${botping}`)
  }
}
