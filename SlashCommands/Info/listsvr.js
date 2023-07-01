module.exports = {
  name: "listserver",
  description: "list server",
  run: async (client, interaction, args, secret, trans, langc, guild) => {
    if (interaction.user.id !== '574194910459199489') {
      return interaction.reply(`~~笑死這功能 <@574194910459199489> 專用~~`);
    }
    // Get all server informations
    let str = `\`\`\``;
    client.guilds.cache.forEach(guild => {
      str += `\n${guild.name}(${guild.id}), ${guild.memberCount} users, ${guild.roles.cache.size} roles, ${guild.channels.cache.size} channels`;
    });
    // Reply to user
    interaction.reply(`${str}\`\`\``);
  }
}