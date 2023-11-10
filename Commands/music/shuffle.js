module.exports = {
  name: "shuffle",
  inVoiceChannel: true,
  trans: "music",
  run: async (client, message, args, secret, prefix, trans) => {
    // Get translate
    var no_queue = trans.strings.find((it) => it.name === "no_queue").trans;
    var shuffled = trans.strings.find((it) => it.name === "shuffled").trans;

    const queue = client.distube.getQueue(message);
    if (!queue)
      return message.channel.send(`${client.emotes.error} | ${no_queue}`);
    queue.shuffle();
    message.channel.send(shuffled);
  },
};
