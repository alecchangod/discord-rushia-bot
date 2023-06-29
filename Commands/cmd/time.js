module.exports = {
  name: "time",
  aliases: ["time"],
  description: 'get current time',
  run: async (client, message, args, secret, prefix, trans, langc) => {
    // Get translations
    const { trans: current_time } = trans.find(it => it.name === "time")
                                           .lang.find(it => it.code === langc)
                                           .strings.find(it => it.name === "current_time");
    // Give reply about the current time
    message.reply(`${current_time}<t:${Math.floor(Date.now() / 1000)}>`);
  }
}
