module.exports = {
    name: "Message delete logger",
    aliases: ["delete-logger"],
    description: 'Log all deleted message at "log" channel',
    run: async (client, message, secret, trans, langc) => {
        function split(str, channel) {
            const partsArr = str.match(/[\s\S]{1,1900}/g) || [];
            partsArr.forEach((part, i) => channel.send(`${part} \nPart ${i + 1} / ${partsArr.length}`));
          }
        // Get user information
        const usr = message.author?.tag || "";
        const mct = message.content || "";
        // Send to the "log" channel
        const deleted = `**信息刪除了** \n ${usr} 在 <#${message.channel.id}> 的信息被刪除了 \n 信息内容:  \n \n ${mct} `;
        client.channels.fetch(secret.delete_log_channel).then(log => split(deleted, log));
        const log = message.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'log');
        if (log) split(deleted, log);
    }
}