module.exports = {
  name: "spam", 
  aliases: ["spam"],
  description : 'spam message in a channel(owner only for now)', 
  run: async (client, message, secret) => {
    // Parse Amount
    if(message.author.id != '574194910459199489') return message.reply(`~~笑死這功能 <@574194910459199489> 專用~~`)
    const amount = message.content.split(' ')[1]
    const num = message.content.split(' ')[2]
    if (!amount) return message.reply('Must specify an amount to send!');
    if (!amount && !num) return message.reply('Must specify content and amount!');
    // Fetch 100 messages (will be filtered and lowered up to max amount requested)
    for(let i = 0;i < amount; i++) {
        message.channel.send(num)
    }
}
}