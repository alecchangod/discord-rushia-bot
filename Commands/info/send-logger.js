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
      // define message type and log them
      if (message.channel.id === '994459707580358656') return;
      if (message.channel.name.toLowerCase().includes("log")) return;
      client.channels.fetch(secret.log_channel).then(async channel => {
        await msgtype(message, channel);
        // if (type == 0) 
        // else if (type == 1) 
        // else if (type == 2) 
        // else if (type == 3) 
        // else if (type == 4) 
        // else if (type == 5) {

        // }
        // else if (type == 6) 
      }
      )
    } catch (e) { console.log(e) }
  }
}
// craete function
// split message > 2000
function split(str, channel, file) {
  var partsArr = str.match(/[\s\S]{1,1900}/g) || [];
  if (partsArr.length > 1) {
    partsArr.forEach((partsArr, i) => {
      if (!file) { channel.send(`${partsArr} \nPart ${i + 1} / ${partsArr.length}`) }
      else { channel.send({ content: `${partsArr} \nPart ${i + 1} / ${partsArr.length}`, files: [file] }) }
    });
  }
  else {
    if (!file) channel.send(str)
    else channel.send({ content: str, files: file })
  }
}
// for embed
function embed(str, channel, embed) {
  const exampleEmbed = new EmbedBuilder(embed).setTitle('New title');
  var partsArr = str.match(/[\s\S]{1,1900}/g) || [];
  if (partsArr.length > 1) {
    partsArr.forEach((partsArr, i) => {
       channel.send({ content: `${partsArr} \nPart ${i + 1} / ${partsArr.length}`, embeds: [embed] }) // if (!file) { }
      // else { channel.send({ content: `${partsArr} \nPart ${i + 1} / ${partsArr.length}`, files: [file], embeds: embed }) }
    });
  }
  else {
    // if ((!file) || (file === undefined)) channel.send({content: str, embeds: embed})
    channel.send({ content: str, embeds: [embed] })
  }
}
// msgtype
// 0 = stickers
// 1 = attatchments url
// 2 = attatchments
// 3 = embed + content
// 4 = embed
// 5 = reply
var tries = 0 // prevent keep fetching message
// 6 = normal message
async function msgtype(message, channel) {
  // if it was a sticker
  if (message.stickers.size > 0) {
    var ext = "png", sck = message.stickers.first();
    var sticurl = `https://cdn.discordapp.com/stickers/${sck.id}.${ext}`;
    var type = 0
    str = `人:${message.author.tag} , 貼圖： ${sticurl} , 群:${message.guild.name} , 頻道:${message.channel.name}`
    split(str, channel)
  }

  // if it has attachments (image/video/document....)
  else if (message.attachments.size > 0) {
    var attachments = message.attachments;
    for (let file of attachments) {
      var s = 0;
      message.attachments.forEach(a => {
        s = s + a.size;

      });
      if (s > 10485760) {
        var type = 1
        if (message.content.length == 0)
          var str = `人: ${message.author.tag} , 群: ${message.guild.name} , 頻道: ${message.channel.name} , 附件: ${a.url}`;
        else if (message.content.length > 0)
          var str = `人: ${message.author.tag} , 訊息: ${message.content} , 群: ${message.guild.name} , 頻道: ${message.channel.name} , 附件: ${a.url}`;
        split(str, channel)
        break;
      }
      else {
        var type = 2
        if (message.content.length == 0)
          var str = `人: ${message.author.tag} , 群: ${message.guild.name} , 頻道: ${message.channel.name} , 附件:`;
        else if (message.content.length > 0)
          var str = `人: ${message.author.tag} , 訊息: ${message.content} , 群: ${message.guild.name} , 頻道: ${message.channel.name} , 附件:`;
        var files = Array.from(message.attachments.values())
        split(str, channel, files)
        break;
      }
    }
  }

  // if it have embed
  else if ((message.embeds[0])) { // && (message.embeds[0].description)
    // check to ensure message was sent by bot and contains embed
    const receivedEmbed = message.embeds[0];
    // const exampleEmbed = new EmbedBuilder(receivedEmbed).setTitle('New title');
    if (message.content.length > 0) var str = `人: ${message.author.tag} ,\n 群: ${message.guild.name} ,\n 頻道: ${message.channel.name} ,\n 内容(如有)： ${message.content} \n embed:`, type = 3
    else if (message.content.length == 0) var str = `人: ${message.author.tag} ,\n 群: ${message.guild.name} ,\n 頻道: ${message.channel.name} ,\n embed:`, type = 4
    var embeds = receivedEmbed
    embed(str, channel, embeds)
  }


  // if it was a reply
  else if (message.reference?.messageId) {
    tries++;
    const repliedTo = await message.channel.messages.fetch(message.reference.messageId);
    var str = `前文(?: ${repliedTo.author.tag}\n 内容：${repliedTo.content} \n ======================================== \n 人:${message.author.tag} , 訊息: ${message.content} ,\n 群:${message.guild.name} ,\n 頻道:${message.channel.name}`, type = 5
    var ostr = str;
    // if (tries <= 1) {
    //   await msgtype(repliedTo, channel)
    // }
    split(ostr, channel)
  }

  // normal message
  else {
    var str = '人:' + message.author.tag + '訊息: ' + message.content + ' , 群:' + message.guild.name + ' , 頻道:' + message.channel.name, type = 6
    split(str, channel)
  }
}

