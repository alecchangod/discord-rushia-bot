module.exports = {
  name: 'repeat',
  aliases: ['repeat'],
  inVoiceChannel: true,
  trans: "music",
  run: async (client, message, args, secret, prefix, trans) => {
    // Get translate
    var no_playing = trans.strings.find(it => it.name === "no_playing").trans;
    var r_queue = trans.strings.find(it => it.name === "r_queue").trans;
    var r_song = trans.strings.find(it => it.name === "r_song").trans;
    var off = trans.strings.find(it => it.name === "off").trans;
    var repeat_m = trans.strings.find(it => it.name === "repeat_m").trans;

    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | ${no_playing}`)
    let mode = null
    switch (args[0]) {
      case 'off':
        mode = 0
        break
      case 'song':
        mode = 1
        break
      case 'queue':
        mode = 2
        break
    }
    mode = queue.setRepeatMode(mode)
    mode = mode ? (mode === 2 ? r_queue : r_song) : off
    message.channel.send(`${client.emotes.repeat} | ${repeat_m} \`${mode}\``)
  }
}
