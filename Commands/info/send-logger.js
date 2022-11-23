const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require("@discordjs/builders")
const { ApplicationCommandOptionType, ButtonStyle } = require("discord.js")
module.exports = {
<<<<<<< HEAD
    name: "send-logger", 
    aliases: ["s"],
    run: async (client, message, secret) => {
        try{
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
          break;
          }
          else client.channels.fetch(secret.log_channel).then(channel1 => {
            if (message.content.length == 0) var data = `人: ${message.author.tag} , 群: ${message.guild.name} , 頻道: ${message.channel.name} , 附件:`
            else if (message.content.length > 0) var data = `人: ${message.author.tag} , 訊息: ${message.content} , 群: ${message.guild.name} , 頻道: ${message.channel.name} , 附件:`
            channel1.send({
              files: Array.from(message.attachments.values()),
              content: data
            });
          }); break;
=======
  name: "send-logger",
  aliases: ["s"],
  description: 'log message sent(owner only for now)',
  run: async (client, message, secret) => {
    try {
      // craete function
      function split(str, channel) {
        var partsArr = str.match(/[\s\S]{1,1900}/g) || [];
        if (partsArr.length > 1) {
          partsArr.forEach((partsArr, i) => channel.send(`${partsArr} \nPart ${i + 1} / ${partsArr.length}`));
        }
        else {
          channel.send(str);
>>>>>>> 61925c7 (added message spliting and fixed fetching original message)
        }
      }

      // define message type and log them
      if (message.channel.id === '994459707580358656') return;
      if (message.channel.name.toLowerCase().includes("log")) return;
      client.channels.fetch(secret.log_channel).then(async channel => {
        // if it was a sticker
        if (message.stickers.size > 0) {
          var ext = "png",
              sck = message.stickers.first();
          var sticurl = `https://cdn.discordapp.com/stickers/${sck.id}.${ext}`
          channel.send(`人:${message.author.tag} , 貼圖： ${sticurl} , 群:${message.guild.name} , 頻道:${message.channel.name}`, { split: true })
        }
        // if it has attachments (image/video/document....)
        else if (message.attachments.size > 0) {
          var attachments = message.attachments;
          for (let file of attachments) {
            var s = 0;
            message.attachments.forEach(a => {
              s = s + a.size;

            })
            if (s > 10485760) {
              if (message.content.length == 0) var data = `人: ${message.author.tag} , 群: ${message.guild.name} , 頻道: ${message.channel.name} , 附件: ${a.url}`
              else if (message.content.length > 0) var data = `人: ${message.author.tag} , 訊息: ${message.content} , 群: ${message.guild.name} , 頻道: ${message.channel.name} , 附件: ${a.url}`
              client.channels.fetch(secret.log_channel).then(channel1 => {
                split(data, channel1)
              });
              break;
            }
            else client.channels.fetch(secret.log_channel).then(channel1 => {
              if (message.content.length == 0) var data = `人: ${message.author.tag} , 群: ${message.guild.name} , 頻道: ${message.channel.name} , 附件:`
              else if (message.content.length > 0) var data = `人: ${message.author.tag} , 訊息: ${message.content} , 群: ${message.guild.name} , 頻道: ${message.channel.name} , 附件:`
              split(data, channel1)
              channel1.send({
                files: Array.from(message.attachments.values())
              });
            }); break;
          }
        }
        // if it have embed
        else if ((message.embeds[0]) && (message.embeds[0].description)) {
          // check to ensure message was sent by bot and contains embed
          const receivedEmbed = message.embeds[0];
          const exampleEmbed = new EmbedBuilder(receivedEmbed).setTitle('New title');
          client.channels.fetch(secret.log_channel).then(channel => {
            channel.send({ content: `人: ${message.author.tag} ,\n 群: ${message.guild.name} ,\n 頻道: ${message.channel.name} ,\n 内容(如有)： ${message.content},\n embed:`, embeds: [receivedEmbed] })
          }).catch(err => {
            console.log(err)
          })
        }

        // if it was a reply
        else if (message.reference?.messageId) {
          const repliedTo = await message.channel.messages.fetch(message.reference.messageId);
          var str = `\n 前文(?: ${repliedTo.author.tag}\n 内容：${repliedTo.content} \n ======================================== \n 人:${message.author.tag} , 訊息: ${message.content} ,\n 群:${message.guild.name} ,\n 頻道:${message.channel.name}`
          split(str, channel)
        }
        // normal message
        else {
          var str = '人:' + message.author.tag + '訊息: ' + message.content + ' , 群:' + message.guild.name + ' , 頻道:' + message.channel.name
          split(str, channel);
        }

      }
      )
    } catch (e) { console.log(e) }
  }
}

