module.exports = {
  name: 'stop',
  aliases: ['stop'],
  inVoiceChannel: true,
  run: async (client, message, args, secret, prefix, trans) => {
    // Get translate
    var no_queue = trans.strings.find(it => it.name === "no_queue").trans;
    var stopped = trans.strings.find(it => it.name === "stopped").trans;

    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | ${no_queue}`)
    queue.stop()
    message.channel.send(`${client.emotes.success} | ${stopped}`)
  }
}
