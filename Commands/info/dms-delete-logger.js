module.exports = {
    name: "DMs message delete logger",
    aliases: ["dms-delete-logger"],
    description: 'Log messages deleted in DMs',
    run: async (client, message, secret, trans, b_trans, langc) => {
        let channel = client.channels.fetch(secret.PMlog);
        const _deleted = b_trans.strings.find(it => it.name === "deleted").trans;
        const was_deleted = b_trans.strings.find(it => it.name === "was_deleted").trans;
        const msg_cont = b_trans.strings.find(it => it.name === "msg_cont").trans;
        let deleted = `**${_deleted}** \n ${message.author.discriminator === '0' ? "@" : ""}${message.author.username}${message.author.discriminator === '0' ? "" : `#${message.author.discriminator}`} ${was_deleted}\n${msg_cont}: \n \n  ${message} `
        channel.send(deleted);
    }
}
