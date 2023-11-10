module.exports = {
  name: "Time",
  aliases: ["time"],
  description: "get current time",
  trans: "time",
  run: async (client, message, args, secret, prefix, trans) => {
    // Get translations
    const current_time = trans.strings.find(
      (it) => it.name === "current_time"
    ).trans;
    // Give reply about the current time
    message.reply(`${current_time}<t:${Math.floor(Date.now() / 1000)}>`);
  },
};
