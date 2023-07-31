const moment = require("moment");
async function tombstonegen(client, interaction, args, secret, trans, langc, guild, member) {

    let str = "```\n"
    str += " _______________________________________\n";
    str += "/                                       \\\n";
    str += "|         In Fucking Memory of          |\n";
    str += "|                                       |\n";
    var uname = member.user.username
    str += `|${' '.repeat(('                                       '.length - uname.length) / 2)}${uname}${' '.repeat((uname.length % 2 === 0 ? ('                                       '.length - uname.length) / 2 + 1 : ('                                       '.length - uname.length) / 2))}|\n`;
    str += "|                                       |\n";
    str += `|          ${moment(member.joinedAt).tz('Asia/Taipei').format("YYYY.MM.DD hh:mm:ss")}          |\n`;
    str += "|                  ~                    |\n";
    str += `|          ${moment(Date.now()).tz('Asia/Taipei').format("YYYY.MM.DD hh:mm:ss")}          |\n`;
    str += "|                                       |\n";
    str += "|                                       |\n";
    str += "|           The Hated member            |\n"
    str += "|                                       |\n"
    str += "|          Never in Our Hearts          |\n"
    str += "|                                       |\n"
    var uname = `Rest In Peace, ${member.user.username}`
    str += `|${' '.repeat(('                                       '.length - uname.length) / 2)}${uname}${' '.repeat((uname.length % 2 === 0 ? ('                                       '.length - uname.length) / 2 + 1 : ('                                       '.length - uname.length) / 2))}|\n`;
    str += "\\_______________________________________/\n";
    str += "                   |\n";
    str += "                   |\n";
    str += "                   |\n";
    str += "                   |\n";
    str += "                   |\n";
    str += "```"

    await interaction.channel.send(str);
}

  module.exports = tombstonegen;