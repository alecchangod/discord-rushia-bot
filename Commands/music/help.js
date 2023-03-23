const Discord = require('discord.js')

module.exports = {
  name: 'help',
  aliases: ['h', 'cmd', 'command'],
  run: async (client, message, args, secret, prefix, trans) => {
    message.channel.send({
      embeds: [
        new Discord.EmbedBuilder()
          .setTitle('Commands')
          .addFields(
            { name: 'normal commands', value: client.cmd.map(cmd => `\`${cmd.name}: ${cmd.description}\``).join(',\n ') },
            { name: 'music commands', value: client.music.map(cmd => `\`${cmd.name}: ${cmd.description}\``).join(',\n ') },
            { name: 'twitter commands', value: client.twitter.map(cmd => `\`${cmd.name}: ${cmd.description}\``).join(',\n ') },
            { name: 'base commands', value: client.info.map(cmd => `\`${cmd.name}: ${cmd.description}\``).join(',\n ') }
        )
          // .setDescription("normal commands \n")
          // .setDescription(client.cmd.map(cmd => `\`${cmd.name}: ${cmd.description}\``).join(',\n '))
          // .setDescription("music commands \n")
          // .setDescription(client.music.map(cmd => `\`${cmd.name}: ${cmd.description}\``).join(',\n '))
          // .setDescription("twitter commands \n")
          // .setDescription(client.twitter.map(cmd => `\`${cmd.name}: ${cmd.description}\``).join(',\n '))
          // .setDescription("base commands \n")
          // .setDescription(client.info.map(cmd => `\`${cmd.name}: ${cmd.description}\``).join(',\n '))
          .setColor('Green')
      ]
    })
  }
}
