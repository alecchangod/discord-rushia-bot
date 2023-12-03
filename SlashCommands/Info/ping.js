const trans = require("../../function/common/trans.js");
module.exports = {
  data: {
    name: "ping",
    aliases: ["ping"],
    description: "get your ping",
    trans: "ping",
  },
  async execute(client, interaction, args, secret, _, langc) {
    // Get translation
    const cmd = module.exports.data.name;
    const { your_ping, bot_ping, ms } = await trans(cmd, langc, [
      "your_ping",
      "bot_ping",
      "ms",
    ]);
    // Get ping
    var yourping = new Date().getTime() - interaction.createdTimestamp;
    var botping = Math.round(client.ws.ping);
    // Report ping to the user
    interaction.reply(`${your_ping}: ${yourping}${ms} \n${bot_ping}: ${botping}${ms}`);
  },
};
