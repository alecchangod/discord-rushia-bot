const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/group.sqlite" }); 
module.exports = {
  name: "listsvr", 
  description: "list server",
  run: async (client, interaction, secret) => {
    if(interaction.user.id != '574194910459199489') return interaction.reply(`~~笑死這功能 <@574194910459199489> 專用~~`);
    var g = await db.all(), a = JSON.stringify(g);
    // g.forEach(a => {interaction.reply(a)})
    var a = a.split(",").join(", \n");
    console.log(a)
    interaction.reply(a) //${guild.name}(${guild.id})
}
}