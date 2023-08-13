module.exports = {
  name: 'volume',
  aliases: ['volume'],
  inVoiceChannel: true,
  trans: "music",
  run: async (client, message, args, secret, prefix, trans) => {
    // Get translate
    var no_queue = trans.strings.find(it => it.name === "no_queue").trans;
    var vol_set_to = trans.strings.find(it => it.name === "vol_set_to").trans;
    var invalid_num = trans.strings.find(it => it.name === "invalid_num").trans;

    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | ${no_queue}`)
    const volume = parseInt(args[0])
    if (isNaN(volume)) return message.channel.send(`${client.emotes.error} | ${invalid_num}`)
    queue.setVolume(volume)
    message.channel.send(`${client.emotes.success} | ${vol_set_to} \`${volume}\``)
  }
}
