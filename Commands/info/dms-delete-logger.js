module.exports = {
    name: "DMs message delete logger",
    aliases: ["dm-delete-logger"],
    description: 'Log messages deleted in DMs',
    run: async (client, message, secret, trans, langc) => {
        let channel = client.channels.fetch(secret.PMlog);
        let deleted = `**信息刪除了** \n ${message.author.tag} 的信息被刪除了 \n 信息内容: \n \n  ${message} `
        channel.send(deleted);
    }
}
