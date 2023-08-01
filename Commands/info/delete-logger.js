module.exports = {
    name: "Message delete logger",
    aliases: ["delete-logger"],
    description: 'Log all deleted message at "log" channel',
    run: async (client, message, secret, trans, b_trans, langc) => {
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
        var _deleted = b_trans.strings.find(it => it.name === "deleted").trans;
        var smessage = b_trans.strings.find(it => it.name === "message").trans;
        var was_deleted = b_trans.strings.find(it => it.name === "was_deleted").trans;
        var msg_cont = b_trans.strings.find(it => it.name === "msg_cont").trans;
        var deleted = `**${_deleted}** \n ${usr} ${smessage} <#${message.channel.id}> ${was_deleted} \n${msg_cont}:  \n \n ${mct} `;
        client.channels.fetch(secret.delete_log_channel).then(log => split(deleted, log));

        // Don't log message deleted in the "log"
        if (message.channel.name.includes("log")) return;
        var _deleted = trans.strings.find(it => it.name === "deleted").trans;
        var smessage = trans.strings.find(it => it.name === "message").trans;
        var was_deleted = trans.strings.find(it => it.name === "was_deleted").trans;
        var msg_cont = trans.strings.find(it => it.name === "msg_cont").trans;
        var deleted = `**${_deleted}** \n ${usr} ${smessage} <#${message.channel.id}> ${was_deleted} \n${msg_cont}:  \n \n ${mct} `;
        const log = message.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'log');
        if (log) split(deleted, log);
    }
}