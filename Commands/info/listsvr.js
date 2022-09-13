module.exports = {
  name: "listsvr", 
  aliases: ["l"],
  run: async (client, message, secret) => {
    // Parse Amount
    if(message.author.id != '574194910459199489') return message.reply(`~~笑死這功能 <@574194910459199489> 專用~~`);
    client.guilds.cache.forEach(guild => message.reply(`${guild.name}(${guild.id})`));
}
}