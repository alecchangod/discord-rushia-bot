const { Constants } = require('discord.js')

module.exports = {
  name: 'join',
  aliases: ['join'],
  run: async (client, message, args, secret, prefix, trans) => {
    // Get translate
    var invalid_ch = trans.strings.find(it => it.name === "invalid_ch").trans;
    var no_ch = trans.strings.find(it => it.name === "no_ch").trans;

    let voiceChannel = message.member.voice.channel
    if (args[0]) {
      voiceChannel = await client.channels.fetch(args[0])
      if (!Constants.VoiceBasedChannelTypes.includes(voiceChannel?.type)) {
        return message.channel.send(`${client.emotes.error} | ${args[0]} ${invalid_ch}`)
      }
    }
    if (!voiceChannel) {
      return message.channel.send(
        `${client.emotes.error} | ${no_ch}`
      )
    }
    client.distube.voices.join(voiceChannel)
  }
}
