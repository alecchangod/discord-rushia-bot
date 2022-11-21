module.exports = {
    name: "delete-logger", 
    aliases: ["d"],
    description : 'log deleted message', 
    run: async(client, message, secret) => {
        let deleted = `**信息刪除了** \n ${message.author.tag} 在 ${message.channel.name} 的信息被刪除了 \n 信息内容:  \n \n ${message} `
    // post in the server's log channel, by finding the accuratebotlog channel (SERVER ADMINS **MUST** CREATE THIS CHANNEL ON THEIR OWN, IF THEY WANT A LOG)
    let log = message.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'log');
    if (!log) return;
    log.send(deleted)
        
        }  
    }