const { PermissionsBitField } = require('discord.js');
module.exports = {
  name: "spam", 
  aliases: ["spam"],
  description : 'spam message in a channel(owner only for now)', 
  run: async (client, message) => {
    // Parse Amount
    var user = await message.guild.members.fetch(message.author)
    if(user.permissions.has(PermissionsBitField.Flags.ManageMessages)){
    const amount = message.content.split(' ')[1]
    const num = message.content.split(' ')[2]
    if (!amount) return message.reply('Must specify an amount to send!');
    if (!amount && !num) return message.reply('Must specify content and amount!');
    // Fetch 100 messages (will be filtered and lowered up to max amount requested)
    for(let i = 0;i < amount; i++) {
        message.channel.send(num)
    }}
    else message.reply("You don't have the required permission.")
}
}