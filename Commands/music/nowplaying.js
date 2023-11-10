module.exports = {
  name: "nowplaying",
  aliases: ["nowplaying"],
  inVoiceChannel: true,
  trans: "music",
  run: async (client, message, args, secret, prefix, trans) => {
    // Get translate
    var no_queue = trans.strings.find((it) => it.name === "no_queue").trans;
    var playing = trans.strings.find((it) => it.name === "playing").trans;
    var by = trans.strings.find((it) => it.name === "by").trans;

    const queue = client.distube.getQueue(message);
    if (!queue)
      return message.channel.send(`${client.emotes.error} | ${no_queue}`);
    const song = queue.songs[0];
    message.channel.send(
      `${client.emotes.play} | ${playing} **\`${song.name}\`**, ${by} ${song.user}`
    );
  },
};
