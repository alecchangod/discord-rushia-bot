const { Constants } = require("discord.js");
module.exports = {
  name: "join",
  aliases: ["join"],
  trans: "music",
  run: async (client, message, args, secret, prefix, trans) => {
    // Get translate
    var invalid_ch = trans.strings.find((it) => it.name === "invalid_ch").trans;
    var no_ch = trans.strings.find((it) => it.name === "no_ch").trans;

    let voiceChannel;
    if (args[0]) {
      voiceChannel = await client.channels.fetch(args[0]);
      if (!Constants.VoiceBasedChannelTypes.includes(voiceChannel?.type)) {
        return message.channel.send(
          `${client.emotes.error} | ${args[0]} ${invalid_ch}`
        );
      }
    }
    else if (message.member.voice.channel.id){
      voiceChannel = await client.channels.fetch(
        message.member.voice.channel.id
      );
    }

    if (!voiceChannel) {
      return message.channel.send(`${client.emotes.error} | ${no_ch}`);
    }

    await client.distube.voices.join(voiceChannel);
  },
};
