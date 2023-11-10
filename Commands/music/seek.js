module.exports = {
  name: "seek",
  inVoiceChannel: true,
  trans: "music",
  run: async (client, message, args, secret, prefix, trans) => {
    // Get translate
    var no_queue = trans.strings.find((it) => it.name === "no_queue").trans;
    var no_time = trans.strings.find((it) => it.name === "no_time").trans;
    var invalid_num = trans.strings.find(
      (it) => it.name === "invalid_num"
    ).trans;
    var seeked = trans.strings.find((it) => it.name === "seeked").trans;

    const queue = client.distube.getQueue(message);
    if (!queue)
      return message.channel.send(`${client.emotes.error} | ${no_queue}`);
    if (!args[0]) {
      return message.channel.send(`${client.emotes.error} | ${no_time}`);
    }
    const time = Number(args[0]);
    if (isNaN(time))
      return message.channel.send(`${client.emotes.error} | ${invalid_num}`);
    queue.seek(time);
    message.channel.send(`${seeked} ${time}!`);
  },
};
