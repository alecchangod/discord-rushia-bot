module.exports = {
    name: "DMs edit logger",
    description: 'log messages edit in DMs',
    run: async (client, oldMessage, newMessage, secret, trans, langc) => {
        if (!oldMessage) var oldMessage = 'not recorded'
        let log = client.channels.fetch(secret.PMlog);
        log.send(`人：${newMessage.author.tag} \n \n 原信息： ${oldMessage} ,新信息： ${newMessage}`);
    }
}