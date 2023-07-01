module.exports = {
    name: 'ping',
    description: 'ping',
    run: async (client, interaction, args, secret, trans, langc, guild) => {
        const yourping = new Date().getTime() - interaction.createdTimestamp
        const botping = Math.round(client.ws.ping)
        interaction.reply({
            content: `Your ping: ${yourping} \nBots ping: ${botping}`
        })
    }
}
