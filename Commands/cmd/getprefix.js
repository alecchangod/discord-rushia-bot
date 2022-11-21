const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/prefix.sqlite" }); 
module.exports = {
    name : 'getprefix', 
    aliases : ['gp', 'get-prefix'], 
    description : 'get prefix/serer', 
    run : async(client, message, args, prefix) => {

    // Getting an object from the database:
    const a = await db.get(`prefix_${message.guild.id}`);

    const aa = await db.get(`c_${message.guild.id}`);

    const aaa = await db.get(`t_${message.guild.id}`);

    var msg = `current prefix: ${a} \n set by ${aa} \n in <t:${aaa}>`;
    if(a == null) {msg = `using default prefix now`}
    message.reply(msg)











}
}