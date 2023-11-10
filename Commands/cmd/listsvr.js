module.exports = {
  name: "List server",
  aliases: ["listsvr"],
  description: "list server(owner only)",
  trans: "owner_only",
  run: async (client, message, args, secret, prefix, trans) => {
    try {
      // Don't allow other people to use it
      const owner_only = trans.strings.find(
        (it) => it.name === "owner_only"
      ).trans;
      if (message.author.id !== secret.me) {
        return message.reply(`${owner_only}`);
      }
      // Get all server informations
      let str = "```";
      client.guilds.cache.forEach((guild) => {
        str += `\n${guild.name}(${guild.id}), ${guild.memberCount} users, ${guild.roles.cache.size} roles, ${guild.channels.cache.size} channels`;
      });
      str += "```";
      // Send current joined server
      message.reply(`${str}`);
    } catch (error) {
      console.error(`Error executing listsvr command: ${error}`);
    }
  },
};
