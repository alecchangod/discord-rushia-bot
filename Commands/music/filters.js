module.exports = {
  name: "filter",
  aliases: ["filters"],
  inVoiceChannel: true,
  trans: "music",
  run: async (client, message, args, secret, prefix, trans) => {
    // Get translate
    var no_queue = trans.strings.find((it) => it.name === "no_queue").trans;
    var invalid = trans.strings.find((it) => it.name === "invalid").trans;
    var cur_filter = trans.strings.find((it) => it.name === "cur_filter").trans;
    var off = trans.strings.find((it) => it.name === "off").trans;

    const queue = client.distube.getQueue(message);
    if (!queue)
      return message.channel.send(`${client.emotes.error} | ${no_queue}`);
    const filter = args[0];
    if (filter === "off" && queue.filters.size) queue.filters.clear();
    else if (Object.keys(client.distube.filters).includes(filter)) {
      if (queue.filters.has(filter)) queue.filters.remove(filter);
      else queue.filters.add(filter);
    } else if (args[0])
      return message.channel.send(`${client.emotes.error} | ${invalid}`);
    message.channel.send(
      `${cur_filter}: \`${queue.filters.names.join(", ") || off}\``
    );
  },
};
