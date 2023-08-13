module.exports = {
  name: 'playtop',
  aliases: ['playtop'],
  inVoiceChannel: true,
  trans: "music",
  run: async (client, message, args, secret, prefix, trans) => {
    // Get translate
    var not_found = trans.strings.find(it => it.name === "not_found").trans;

    const string = args.join(' ')
    if (!string) return message.channel.send(`${client.emotes.error} | ${not_found}`)
    client.distube.play(message.member.voice.channel, string, {
      member: message.member,
      textChannel: message.channel,
      message,
      position: 1
    })
  }
}
