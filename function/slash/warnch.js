async function warnch(client, interaction, args, secret, trans, guild, member, status) {

    const doing = trans.strings.find(it => it.name === "status").trans;

    let warn_channel = interaction.options.getChannel('channel');
    let channel_id = warn_channel ? warn_channel.id : null;    
    const idk = trans.strings.find(it => it.name === "idk").trans;
    const reason = interaction.options.getString('reason') || `${idk} <:0V0:970325975810334750>`;


    if (channel_id) {
        const channel = await client.channels.fetch(channel_id);
        const human = trans.strings.find(it => it.name === "human").trans;
        const why = trans.strings.find(it => it.name === "why").trans;
        channel.send(`**${doing}**\n${human}: ${member} <:bananaV3:958346989597241344>\n${why}: ${reason}`).catch(console.log);
    }
}

module.exports = warnch;