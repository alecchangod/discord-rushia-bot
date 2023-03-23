module.exports = {
    name: "delete-logger",
    aliases: ["d"],
    description: 'log deleted message',
    run: async (client, message, args, secret, prefix, trans) => {
        var usr = message.author?.tag, mct = message.content
        if (usr === undefined) { var usr = "\` \`", mct = "\` \`" }
        let deleted = `**信息刪除了** \n ${usr} 在 <#${message.channel.id}> 的信息被刪除了 \n 信息内容:  \n \n ${mct} `
        // post in the server's log channel, by finding the accuratebotlog channel (SERVER ADMINS **MUST** CREATE THIS CHANNEL ON THEIR OWN, IF THEY WANT A LOG)
        let log = message.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'log');
        if (!log) return;
        log.send(deleted)
    }
}