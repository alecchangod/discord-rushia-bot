module.exports = {
    name: "DMs edit logger",
    aliases: ["dm-edit-logger"],
    description: 'log messages edit in DMs',
    run: async (client, oldMessage, newMessage, secret, trans, langc) => {
        if (!oldMessage) var oldMessage = 'not recorded'
        let log = client.channels.fetch(secret.PMlog);
        log.send(`人：${newMessage.author.discriminator === '0' ? "@" : ""}${newMessage.author.username}${newMessage.author.discriminator === '0' ? "" : `#${newMessage.author.discriminator}`} \n \n 原信息： ${oldMessage} ,新信息： ${newMessage}`);
    }
}