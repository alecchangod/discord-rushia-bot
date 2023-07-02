module.exports = {
    name: "Message delete logger",
    aliases: ["delete-logger"],
    description: 'Log all deleted message at "log" channel',
    run: async (client, message, secret, trans, langc) => {
        function split(str, channel) {
            let startPos = 0;
            let partNumber = 1;
            let totalParts = Math.ceil(str.length / 1850);
            while (startPos < str.length) {
              let endPos = startPos + 1900;
              if (endPos < str.length) {
                const lastSpacePos = str.lastIndexOf(' ', endPos);
                const lastNewLinePos = str.lastIndexOf('\n', endPos);
                endPos = Math.max(lastSpacePos, lastNewLinePos);
              }
              const part = str.substring(startPos, endPos);
              startPos = endPos + 1;
          
              const content = `${part} \nPart ${partNumber} / ${totalParts}`;
              channel.send(content);
          
              partNumber++;
            }
          };
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