const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/prefix.sqlite" }); 
module.exports = {
    name : 'getprefix', 
    aliases : ['gp'], 
    description : 'get prefix/serer', 
    run : async(client, interaction, args, prefix) => {

    // Getting an object from the database:
    const a = await db.get(`prefix_${interaction.guild.id}`);

    const aa = await db.get(`c_${interaction.guild.id}`);

    const aaa = await db.get(`t_${interaction.guild.id}`);

    var msg = `current prefix: ${a} \n set by ${aa} \n in <t:${aaa}>`;
    if(a == null) {msg = `using default prefix now`}
    interaction.reply(msg)











}
}