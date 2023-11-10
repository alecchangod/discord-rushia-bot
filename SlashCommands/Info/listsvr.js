module.exports = {
  data: {
    name: "listserver",
    description: "list server",
    trans: "owner_only",
  },
  async execute(client, interaction, args, secret, trans) {
    // Don't allow other people to use it
    const owner_only = trans.strings.find(
      (it) => it.name === "owner_only"
    ).trans;
    if (interaction.user.id !== secret.me) {
      return message.reply(`${owner_only}`);
    }
    // Get all server informations
    let str = `\`\`\``;
    client.guilds.cache.forEach((guild) => {
      str += `\n${guild.name}(${guild.id}), ${guild.memberCount} users, ${guild.roles.cache.size} roles, ${guild.channels.cache.size} channels`;
    });
    // Reply to user
    interaction.reply(`${str}\`\`\``);
  },
};
