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
      let wchannelId = channelId ? channelId : member.guild.systemChannelId;
      if (wchannelId) channel = await client.channels.fetch(wchannelId);
      // Welcome new user
      if (channel) await channel.send(`欸有新人~ \n ${member}`);
    } catch (e) {
      console.log(e)
    }
  }
}
