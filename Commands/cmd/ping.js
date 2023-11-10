module.exports = {
  name: "Ping",
  aliases: ["ping"],
  description: "get your ping",
  trans: "ping",
  run: async (client, message, args, secret, prefix, trans) => {
    // Get ping
    var yourping = new Date().getTime() - message.createdTimestamp;
    var botping = Math.round(client.ws.ping);
    // Report ping to the user
    const your_ping = trans.strings.find((it) => it.name === "your_ping").trans;
    const bot_ping = trans.strings.find((it) => it.name === "bot_ping").trans;
    message.channel.send(`${your_ping}: ${yourping}\n${bot_ping}: ${botping}`);
  },
};
