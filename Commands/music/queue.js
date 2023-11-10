module.exports = {
  name: "queue",
  aliases: ["queue"],
  trans: "music",
  run: async (client, message, args, secret, prefix, trans) => {
    // Get translate
    var no_playing = trans.strings.find((it) => it.name === "no_playing").trans;
    var playing = trans.strings.find((it) => it.name === "playing").trans;
    var s_queue = trans.strings.find((it) => it.name === "queue").trans;

    const queue = client.distube.getQueue(message);
    if (!queue)
      return message.channel.send(`${client.emotes.error} | ${no_playing}`);
    const q = queue.songs
      .map(
        (song, i) =>
          `${i === 0 ? `${playing}:` : `${i}.`} ${song.name} - \`${
            song.formattedDuration
          }\``
      )
      .join("\n");
    var str = `${client.emotes.queue} | **${s_queue}**\n${q}`;
    var partsArr = str.match(/[\s\S]{1,1900}/g) || [];
    if (partsArr.length > 1) {
      partsArr.forEach((partsArr, i) =>
        message.channel.send(`${partsArr} \nPart ${i + 1} / ${partsArr.length}`)
      );
    } else {
      message.channel.send(str);
    }
  },
};
