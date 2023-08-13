module.exports = {
  name: 'previous',
  inVoiceChannel: true,
  trans: "music",
  run: async (client, message, args, secret, prefix, trans) => {
    // Get translate
    var no_queue = trans.strings.find(it => it.name === "no_queue").trans;
    var now_playing = trans.strings.find(it => it.name === "now_playing").trans;

    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | ${no_queue}`)
    const song = queue.previous()
    message.channel.send(`${client.emotes.success} | ${now_playing}:\n${song.name}`)
  }
}
