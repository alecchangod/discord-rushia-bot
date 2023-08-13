
const scalc = require('scalc')
module.exports = {
    name: "Calculator",
    aliases: ["cal"],
    description: 'Calculator',
    trans: "calculator",
    run: async (client, message, args, secret, prefix, trans) => {
        try {
            //   Get expression
            const q = message.content.substring(5);
            const no_exec = trans.strings.find(it => it.name === "no_exec").trans;
            if (!q) return message.reply(no_exec);
            // Report result to the user
            const result = trans.strings.find(it => it.name === "result").trans;
            const is = trans.strings.find(it => it.name === "is").trans;
            message.reply(`${result} ${q} ${is} ${String(scalc(q))}`);
        } catch (error) {
            message.channel.send(String(error).split("Error: ")[1]);
        }
    }
}
