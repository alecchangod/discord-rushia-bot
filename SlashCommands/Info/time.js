module.exports = {
  data: {
  name: "time",
  aliases: ["time"],
  description: 'get current time',
  },
  async execute(client, interaction, args, secret, trans, langc, guild) {
    // Get translations
    const { trans: current_time } = trans.strings.find(it => it.name === "current_time");
    // Give reply about the current time
    interaction.reply(`${current_time}<t:${Math.floor(Date.now() / 1000)}>`);
  }
}
