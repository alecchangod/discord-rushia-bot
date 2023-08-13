module.exports = {
  name: 'leave',
  trans: "music",
  run: async (client, message) => {
    client.distube.voices.leave(message)
  }
}
