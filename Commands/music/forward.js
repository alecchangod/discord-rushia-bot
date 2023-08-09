module.exports = {
  name: 'forward',
  inVoiceChannel: true,
  run: async (client, message, args, secret, prefix, trans) => {
    // Get translate
    var no_queue = trans.strings.find(it => it.name === "no_queue").trans;
    var no_time = trans.strings.find(it => it.name === "no_time").trans;
    var invalid_time = trans.strings.find(it => it.name === "invalid_time").trans;
    var forwarded = trans.strings.find(it => it.name === "forwarded").trans;

    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | ${no_queue}`)
    if (!args[0]) {
      return message.channel.send(`${client.emotes.error} | ${no_time}`)
    }
    const time = Number(args[0])
    if (isNaN(time)) return message.channel.send(`${client.emotes.error} | ${invalid_time}`)
    queue.seek((queue.currentTime + time))
    message.channel.send(`${forwarded} ${time}!`)
  }
}
