module.exports = {
  name: 'resume',
  aliases: ['resume'],
  inVoiceChannel: true,
  run: async (client, message, args, secret, prefix, trans) => {
    // Get translate
    var no_queue = trans.strings.find(it => it.name === "no_queue").trans;
    var resumed = trans.strings.find(it => it.name === "resumed").trans;
    var not_paused = trans.strings.find(it => it.name === "not_paused").trans;

    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | ${no_queue}`)
    if (queue.paused) {
      queue.resume()
      message.channel.send(resumed)
    } else {
      message.channel.send(not_paused)
    }
  }
}
