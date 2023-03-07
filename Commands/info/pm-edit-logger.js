module.exports = {
    name: "pm-edit-logger",
    aliases: ["p"],
    description: 'log message edit in pm',
    run: async (client, oldMessage, newMessage, secret) => {
        if (!oldMessage) var oldMessage = 'not recorded'
        let log = client.channels.fetch(secret.PMlog).then(log => {
            log.send(`人：${newMessage.author.tag} \n \n 原信息： ${oldMessage} ,新信息： ${newMessage}`);
        })
    }
}