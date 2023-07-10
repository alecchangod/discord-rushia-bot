
const scalc = require('scalc')
module.exports = {
    name: "Calculator",
    aliases: ["cal"],
    description: 'Calculator',
    run: async (client, message, args, secret, prefix, trans, langc) => {
        try {//   Get expression
        const q = message.content.substring(5);
        // Report result to the user
        message.channel.send(String(scalc(q)));
    }catch(error) {
        message.channel.send(String(error).split("Error: ")[1]);
    }
    }
}
