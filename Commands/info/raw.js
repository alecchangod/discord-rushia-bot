module.exports = {
  name: "raw", 
  aliases: ["r"],
  run: async (client, message, secret) => {
    // Parse Amount
    if(message.author.id != '574194910459199489') return message.reply(`~~笑死這功能 <@574194910459199489> 專用~~`)
    message.array(e => {
        message.reply(e)
    });
    message.reply(message)
}
}