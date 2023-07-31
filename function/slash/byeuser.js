async function byeuser(client, interaction, args, secret, trans, langc, guild, member, status) {

    if (status === "ban") {
        interaction.guild.members.ban(member);
    }
    else if (status === "kick") {
        member.kick();
    }

    let joinat = `<t:${Math.floor(new Date(member.joinedAt).getTime() / 1000)}>`;
    let leaveat = `<t:${Math.floor(Date.now() / 1000)}>`;
    interaction.reply(`${member} 誰讓你在這裡廢話？滾（X <:bananaV3:958346989597241344> \n\n~~我們不懷念你~~ \n${joinat} ~ ${leaveat}`);

}

module.exports = byeuser;