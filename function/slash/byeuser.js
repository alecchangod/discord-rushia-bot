async function byeuser(client, interaction, secret, trans, member, status) {

    if (status === "ban") {
        interaction.guild.members.ban(member);
    }
    else if (status === "kick") {
        member.kick();
    }

    const stfu = trans.strings.find(it => it.name === "stfu").trans;
    let joinat = `<t:${Math.floor(new Date(member.joinedAt).getTime() / 1000)}>`;
    let leaveat = `<t:${Math.floor(Date.now() / 1000)}>`;
    interaction.reply(`${member} ${stfu} <:bananaV3:958346989597241344>\n\n${joinat} ~ ${leaveat}`);

}

module.exports = byeuser;