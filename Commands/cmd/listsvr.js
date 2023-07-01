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
      // Get all server informations
      let str = `\`\`\``;
      client.guilds.cache.forEach(guild => {
        str += `\n${guild.name}(${guild.id}), ${guild.memberCount} users, ${guild.roles.cache.size} roles, ${guild.channels.cache.size} channels`;
      });
      // Send current joined server
      message.reply(`${str}\`\`\``);
    } catch (error) {
      console.error(`Error executing listsvr command: ${error}`);
    }
  }
};
