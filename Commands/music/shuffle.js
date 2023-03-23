module.exports = {
  name: 'shuffle',
  inVoiceChannel: true,
  run: async (client, message, args, secret, prefix, trans) => {
    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | There is nothing in the queue right now!`)
    queue.shuffle()
    message.channel.send('Shuffled songs in the queue')
  }
}
