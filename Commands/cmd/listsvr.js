const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/group.sqlite" });

module.exports = {
  name: "List server",
  aliases: ["listsvr"],
  description: 'list server(owner only)',
  run: async (client, message, args, secret, prefix, trans, langc) => {
    try {
      // Don't allow other people to use it
      if (message.author.id !== secret.me) {
        return message.reply(`~~笑死這功能 <@${secret.me}> 專用~~`);
      }
      // Fetch current joined server
      client.guilds.cache.forEach(async (guild) => {
        await db.set(guild.name, guild.id);
      });
      
      const guilds = await db.all();
      // Send current joined server
      message.reply(JSON.stringify(guilds).split(",").join(", \n"));
    } catch (error) {
      console.error(`Error executing listsvr command: ${error}`);
    }
  }
};
