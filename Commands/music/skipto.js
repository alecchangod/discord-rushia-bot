module.exports = {
  name: 'skipto',
  inVoiceChannel: true,
  trans: "music",
  run: async (client, message, args, secret, prefix, trans) => {
    // Get translate
    var no_queue = trans.strings.find(it => it.name === "no_queue").trans;
    var no_time = trans.strings.find(it => it.name === "no_time").trans;
    var invalid_time = trans.strings.find(it => it.name === "invalid_time").trans;
    var skipped = trans.strings.find(it => it.name === "skipped").trans;

    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | ${no_queue}`)
    if (!args[0]) {
      return message.channel.send(`${client.emotes.error} | ${no_time}`)
    }
    const num = Number(args[0])
    if (isNaN(num)) return message.channel.send(`${client.emotes.error} | ${invalid_time}`)
    await client.distube.jump(message, num).then(song => {
      message.channel.send({ content: `${skipped}: ${song.name}` })
    })
  }
}
