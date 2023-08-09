module.exports = {
  name: 'skip',
  inVoiceChannel: true,
  run: async (client, message, args, secret, prefix, trans) => {
    // Get translate
    var no_queue = trans.strings.find(it => it.name === "no_queue").trans;
    var skipped = trans.strings.find(it => it.name === "skipped").trans;

    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | ${no_queue}`)
    try {
      const song = await queue.skip()
      message.channel.send(`${client.emotes.success} | ${skipped}:\n${song.name}`)
    } catch (e) {
      message.channel.send(`${client.emotes.error} | ${e}`)
    }
  }
}
