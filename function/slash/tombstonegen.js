const moment = require("moment");
async function tombstonegen(client, interaction, args, secret, trans, guild, member) {
    
    const mem_of = trans.strings.find(it => it.name === "mem_of").trans;
    const hated = trans.strings.find(it => it.name === "hated").trans;
    const never_in_heart = trans.strings.find(it => it.name === "never_in_heart").trans;
    const rip = trans.strings.find(it => it.name === "rip").trans;

    let str = "```\n"
    str += " _______________________________________\n";
    str += "/                                       \\\n";
    var uname = mem_of;
    str += `|${' '.repeat(('                                       '.length - uname.length) / 2)}${uname}${' '.repeat((uname.length % 2 === 0 ? ('                                       '.length - uname.length) / 2 + 1 : ('                                       '.length - uname.length) / 2))}|\n`;

    str += "|                                       |\n";
    var uname = member.user.username
    str += `|${' '.repeat(('                                       '.length - uname.length) / 2)}${uname}${' '.repeat((uname.length % 2 === 0 ? ('                                       '.length - uname.length) / 2 + 1 : ('                                       '.length - uname.length) / 2))}|\n`;
    str += "|                                       |\n";
    str += `|          ${moment(member.joinedAt).tz('Asia/Taipei').format("YYYY.MM.DD hh:mm:ss")}          |\n`;
    str += "|                  ~                    |\n";
    str += `|          ${moment(Date.now()).tz('Asia/Taipei').format("YYYY.MM.DD hh:mm:ss")}          |\n`;
    str += "|                                       |\n";
    str += "|                                       |\n";
    var uname = hated;
    str += `|${' '.repeat(('                                       '.length - uname.length) / 2)}${uname}${' '.repeat((uname.length % 2 === 0 ? ('                                       '.length - uname.length) / 2 + 1 : ('                                       '.length - uname.length) / 2))}|\n`;
    str += "|                                       |\n"
    var uname = never_in_heart;
    str += `|${' '.repeat(('                                       '.length - uname.length) / 2)}${uname}${' '.repeat((uname.length % 2 === 0 ? ('                                       '.length - uname.length) / 2 + 1 : ('                                       '.length - uname.length) / 2))}|\n`;
    str += "|                                       |\n"
    var uname = `${rip}, ${member.user.username}`
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