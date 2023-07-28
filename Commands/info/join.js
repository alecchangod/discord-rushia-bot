const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });

module.exports = {
  name: "Welcome new member",
  aliases: ["join"],
  description: 'Welsome new member(custom message soon)',
  run: async (client, secret, member, trans, langc) => {
    try {
      // Get the server welcome channel from database
      var channel;
      var channelId = await db.get(`welcome_${member.guild.id}`)
      // Ignore new member in disabled server
      const enabled = await db.get("need_welcome");
      if (!JSON.stringify(enabled)?.includes(member.guild.id)) return;
      channelId = channelId ? channelId : member.guild.systemChannelId;
      if (channelId) channel = member.guild.channels.fetch(channelId);
      // Welcome new user
      if (channel) channel.send(`欸有新人~ \n ${member}`);
    } catch (e) {
      console.log(e)
    }
  }
}
