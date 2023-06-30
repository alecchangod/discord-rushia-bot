const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/welcome.sqlite" });

module.exports = {
  name: "join",
  aliases: ["j"],
  description: 'send a message when user join(custom message soon)',
  run: async (client, secret, member, trans, langc) => {
    try {
      // Get the server welcome channel from database
      var channel;
      var channelId = await db.get(`welcome_${message.guild.id}`);
      if (channelId) channel = member.guild.channels.fetch(channelId);
      // Welcome new user
      if (channel) channel.send('欸有新人~');
    } catch (e) {
      console.log(e)
    }
  }
}
