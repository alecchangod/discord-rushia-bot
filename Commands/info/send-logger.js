const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require("@discordjs/builders")
const { ApplicationCommandOptionType, ButtonStyle } = require("discord.js")
module.exports = {
    name: "send-logger", 
    aliases: ["s"],
    run: async (client, message, secret, Discord) => {
        try{

    // if (message.channel.id === secret.log_channel) return;
    // if (message.channel.id === secret.edit_log_channel) return;
    if (message.channel.id === '994459707580358656') return;
    if (message.channel.name.toLowerCase().includes("log")) return;
    var channel = client.channels.fetch(secret.log_channel).then(channel => {
      if(message.stickers.size > 0) {channel.send('人:' + message.author.tag + ' , 訊息: 啊就貼圖(X , 群:' + message.guild.name + ' , 頻道:' + message.channel.name, { split: true })}

      else if (message.attachments.size > 0) {
        var attachments = message.attachments;
        for (let file of attachments) {
          var s = 0;
          message.attachments.forEach(a=>{
            s=s+a.size;
          
          });
             if (s > 10485760) {
                    if (message.content.length == 0) var data = `人: ${message.author.tag} , 群: ${message.guild.name} , 頻道: ${message.channel.name} , 附件: ${a.url}`
                    else if (message.content.length > 0) var data = `人: ${message.author.tag} , 訊息: ${message.content} , 群: ${message.guild.name} , 頻道: ${message.channel.name} , 附件: ${a.url}`
            client.channels.fetch(secret.log_channel).then(channel1 => {
            channel1.send({
              content: data
            });
          });
          }
          else client.channels.fetch(secret.log_channel).then(channel1 => {
            if (message.content.length == 0) var data = `人: ${message.author.tag} , 群: ${message.guild.name} , 頻道: ${message.channel.name} , 附件:`
            else if (message.content.length > 0) var data = `人: ${message.author.tag} , 訊息: ${message.content} , 群: ${message.guild.name} , 頻道: ${message.channel.name} , 附件:`
            channel1.send({
              files: Array.from(message.attachments.values()),
              content: data
            });
          });
        }
      }

      else if ((message.embeds[0]) && (message.embeds[0].description) ) {
      // check to ensure message was sent by bot and contains embed
      
      const receivedEmbed = message.embeds[0];
      const exampleEmbed = new EmbedBuilder(receivedEmbed).setTitle('New title');
      client.channels.fetch(secret.log_channel).then(channel => {
        channel.send({content: `人: ${message.author.tag} , 群: ${message.guild.name} , 頻道: ${message.channel.name} , embed:`, embeds: [receivedEmbed] })
      }).catch(err => {
        console.log(err)
      })
    }


    else if (message.reference){
      const repliedTo = message.channel.messages.fetch(message.reference.messageId);
      if(!repliedTo.author) return channel.send('人:' + message.author.tag + '訊息: ' + message.content + ' , 群:' + message.guild.name + ' , 頻道:' + message.channel.name, { split: true })
      else channel.send('人:' + message.author.tag + ' , 前文(?: ' + repliedTo.author.tag + '\n ' + repliedTo.content + '訊息: ' + message.content + ' , 群:' + message.guild.name + ' , 頻道:' + message.channel.name, { split: true })
  } 

    else { channel.send('人:' + message.author.tag + '訊息: ' + message.content + ' , 群:' + message.guild.name + ' , 頻道:' + message.channel.name, { split: true }) }
  
  }  
  )} catch(e) {console.log(e)}
}
}