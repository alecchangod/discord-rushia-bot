module.exports = {
    name: "DMs edit logger",
    aliases: ["dms-edit-logger"],
    description: 'log messages edit in DMs',
    run: async (client, oldMessage, newMessage, secret, trans, b_trans) => {
        if (!oldMessage) var oldMessage = trans.strings.find(it => it.name === "not_recorded").trans;
        let log = client.channels.fetch(secret.PMlog);
        const human = b_trans.strings.find(it => it.name === "user").trans;
        const old_msg = b_trans.strings.find(it => it.name === "old_msg").trans;
        const new_msg = b_trans.strings.find(it => it.name === "new_msg").trans;
        log.send(`${human}: ${newMessage.author.discriminator === '0' ? "@" : ""}${newMessage.author.username}${newMessage.author.discriminator === '0' ? "" : `#${newMessage.author.discriminator}`}\n\n${old_msg}: ${oldMessage} ,${new_msg}: ${newMessage}`);
    }
}