module.exports = {
  name: 'autoplay',
  inVoiceChannel: true,
  run: async (client, message, args, secret, prefix, trans) => {
    const queue = client.distube.getQueue(message)
    var no_queue = trans.strings.find(it => it.name === "no_queue").trans;
    if (!queue) return message.channel.send(`${client.emotes.error} | ${no_queue}`)
    const autoplay = queue.toggleAutoplay()
    var autoplay_t = trans.strings.find(it => it.name === "autoplay").trans;
    var on = trans.strings.find(it => it.name === "on").trans;
    var off = trans.strings.find(it => it.name === "off").trans;
    message.channel.send(`${client.emotes.success} | ${autoplay_t}: \`${autoplay ? on : off}\``)
  }
}
