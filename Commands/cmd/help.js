const Discord = require('discord.js')

module.exports = {
  name: 'help',
  aliases: ['help'],
  trans: "help",
  run: async (client, message, args, secret, prefix, trans) => {
    // Get translate
    var cmd = trans.strings.find(it => it.name === "cmd").trans;
    var n_cmd = trans.strings.find(it => it.name === "n_cmd").trans;
    var m_cmd = trans.strings.find(it => it.name === "m_cmd").trans;
    var b_cmd = trans.strings.find(it => it.name === "b_cmd").trans;
    message.channel.send({
      embeds: [
        new Discord.EmbedBuilder()
          .setTitle(cmd)
          .addFields(
            { name: n_cmd, value: client.cmd.map(cmd => `\`${cmd.name}(${cmd.aliases[0]}): ${cmd.description}\``).join(',\n ') },
            { name: m_cmd, value: client.music.map(cmd => `\`${cmd.name}: ${cmd.description}\``).join(',\n ') },
            { name: b_cmd, value: client.info.map(cmd => `\`${cmd.name}: ${cmd.description}\``).join(',\n ') }
        )
          .setColor('Green')
      ]
    })
  }
}
