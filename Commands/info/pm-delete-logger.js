module.exports = {
    name: "pm-delete-logger",
    aliases: ["p"],
    description: 'log message delete in pm',
    run: async (client, message, secret) => {
        let channel = client.channels.fetch(secret.PMlog).then(channel => {
            let deleted = `**信息刪除了** \n ${message.author.tag} 的信息被刪除了 \n 信息内容: \n \n  ${message} `
            channel.send(deleted)
        }
        )
    }
}