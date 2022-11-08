const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/group.sqlite" }); 
module.exports = {
  name: "listsvr", 
  description: "list server",
  run: async (client, interaction, secret) => {
    if(interaction.user.id != '574194910459199489') return interaction.reply(`~~笑死這功能 <@574194910459199489> 專用~~`);
    client.guilds.cache.forEach(guild => (async() => {await db.set(guild.name, guild.id)})()); 
    console.log(db.all())
    interaction.reply(JSON.stringify(await db.all()).split(",").join(", \n")) //${guild.name}(${guild.id})
}
}