module.exports = {
  name: 'play',
  aliases: ['p'],
  inVoiceChannel: true,
  run: async (client, message, args, secret, prefix, trans) => {
    console.log("start play")
    const string = args.join(' ')
    console.log("string:", string)
    if (!string) return message.channel.send(`${client.emotes.error} | Please enter a song url or query to search.`)
    console.log("have link")
    client.distube.play(message.member.voice.channel, string, {
      member: message.member,
      textChannel: message.channel,
      message
    })
  }
}
