const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/group.sqlite" }); 
module.exports = {
  name: "listsvr", 
  aliases: ["l"],
  run: async (client, message, secret) => {
    // Parse Amount
    if(message.author.id != '574194910459199489') return message.reply(`~~笑死這功能 <@574194910459199489> 專用~~`);
    client.guilds.cache.forEach(guild => (async() => {await db.set(guild.name, guild.id)})()); 
    var guild = await db.all()
    message.reply(JSON.stringify(guild).split(",").join(", \n"))
}
}