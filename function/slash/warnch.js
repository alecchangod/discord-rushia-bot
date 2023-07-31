async function warnch(client, interaction, args, secret, trans, langc, guild, member, status) {

    let doing;
    if (status === "ban") {
        doing = "Banned";
    }
    else if (status === "kick") {
        doing = "Kicked";
    }
    else {
        doing = "Warned"
    }

    let warn_channel = interaction.options.getChannel('channel');
    let channel_id = warn_channel ? warn_channel.id : null;
    const reason = interaction.options.getString('reason');

    if (channel_id) {
        const channel = await client.channels.fetch(channel_id);
        channel.send(`**${doing}**\n人: ${member} <:bananaV3:958346989597241344>\n原因:${reason}`).catch(console.log);
    }
}

module.exports = warnch;