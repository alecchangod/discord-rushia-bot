module.exports = {
  name: 'pause',
  aliases: ['pause', 'hold'],
  inVoiceChannel: true,
  trans: "music",
  run: async (client, message, args, secret, prefix, trans) => {
    // Get translate
    var no_queue = trans.strings.find(it => it.name === "no_queue").trans;
    var resumed = trans.strings.find(it => it.name === "resumed").trans;
    var paused = trans.strings.find(it => it.name === "paused").trans;

    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | ${no_queue}`)
    if (queue.paused) {
      queue.resume()
      return message.channel.send(resumed)
    }
    queue.pause()
    message.channel.send(paused)
  }
}
