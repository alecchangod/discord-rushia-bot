module.exports = {
    name: "Message delete logger",
    description: 'Log all deleted message at "log" channel',
    run: async (client, message, secret, trans, langc) => {
        // Get user information
        const usr = message.author?.tag || "";
        const mct = message.content || "";
        // Send to the "log" channel
        const deleted = `**信息刪除了** \n ${usr} 在 <#${message.channel.id}> 的信息被刪除了 \n 信息内容:  \n \n ${mct} `;
        const log = message.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'log');
        if (log) log.send(deleted);
    }
}