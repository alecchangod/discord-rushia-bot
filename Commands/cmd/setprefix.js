const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/prefix.sqlite" }); 
const { Permissions } = require('discord.js');
module.exports = {
    name : 'setprefix', 
    aliases : ['sp'], 
    description : 'set prefix/serer', 
    run : async(client, message) => {
        const member = message.guild.members.cache.get(message.author.id)
        if(!member.permissions.has('ADMINISTRATOR')) return message.reply('笑死你沒權限');

        var newprefix0 = message.content.split(' ')
        var newprefix = newprefix0[1]
        
        if(!newprefix) return message.reply('啊到底要設什麽前綴(X')
        if(newprefix.length > 5) return message.reply('前綴太長了w \n 5個字内, 謝謝');

    // self calling async function just to get async
    // Setting an object in the database:
    await db.set(`prefix_${message.guild.id}`, newprefix);
    console.log(`prefix of ${message.guild.name} has been set to ${newprefix}`)

    const author = "`" + message.author.tag + "`"

    await db.set(`c_${message.guild.id}`, author);
    console.log(`prefix of ${message.guild.name}t was set by ${author}`)

    await db.set(`t_${message.guild.id}`, Math.floor(new Date() / 1000));
    console.log(`prefix of ${message.guild.name}t was set at ${Math.floor(new Date() / 1000)}`)



    // Getting an object from the database:
    const a = await db.get(`prefix_${message.guild.id}`);
    console.log(`${message.guild.name}'s newprefix was checked working: \n \n ${a}`)

    const aa = await db.get(`c_${message.guild.id}`);
    console.log(`${message.guild.name}t was checked set by: \n \n \` ${aa} `/``)

    const aaa = await db.get(`t_${message.guild.id}`);
    console.log(`${message.guild.name}t was checked set by: \n \n  ${aaa} `)


    const msg = `current prefix: ${a} \n set by ${aa} \n in <t:${aaa}>`
    message.reply(msg)

}
}