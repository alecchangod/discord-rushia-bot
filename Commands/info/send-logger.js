const { EmbedBuilder } = require("@discordjs/builders")

module.exports = {
  name: "send-logger",
  aliases: ["s"],
  description: 'log message sent(owner only for now)',
  run: async (client, message, secret) => {
    try {
      if (message.channel.id === '994459707580358656' || message.channel.name.toLowerCase().includes("log")) return;
      
      const channel = await client.channels.fetch(secret.log_channel);
      await msgtype(message, channel);
    } catch (e) { 
      console.log(e) 
    }
  }
};
function split(str, channel, file) {
  var partsArr = str.match(/[\s\S]{1,1900}/g) || [];
  partsArr.forEach((part, i) => {
    const content = `${part} \nPart ${i + 1} / ${partsArr.length}`;
    channel.send(file ? { content, files: [file] } : content);
  });
};
function embed(str, channel, embed) {
  const exampleEmbed = new EmbedBuilder(embed).setTitle('New title');
  var partsArr = str.match(/[\s\S]{1,1900}/g) || [];
  partsArr.forEach((part, i) => {
    const content = `${part} \nPart ${i + 1} / ${partsArr.length}`;
    channel.send({ content, embeds: [embed] });
  });
};
// msgtype
// 0 = stickers
// 1 = attatchments url
// 2 = attatchments
// 3 = embed + content
// 4 = embed
// 5 = reply
let tries = 0 // prevent keep fetching message
// 6 = normal message
async function msgtype(message, channel) {
  // if it was a sticker
  if (message.stickers.size > 0) {
    const ext = "png";
    const sck = message.stickers.first();
    const sticurl = `https://cdn.discordapp.com/stickers/${sck.id}.${ext}`;
    let str = '';
    let files = [];
    if (message.attachments.size > 0) {
      message.attachments.forEach(attachment => {
        const hasContent = message.content.length > 0;
        const attachmentText = attachment.size > 10485760 ? `, \n 附件: ${attachment.url}` : ', \n 附件:';
        str = `人: ${message.author.tag} ,\n${hasContent ? ' 訊息: ' + message.content + ' ,' : ''} \n 群: ${message.guild.name} , 貼圖： ${sticurl} ,\n 頻道: ${message.channel.name}${attachmentText}`;
        if (attachment.size <= 10485760) {
          files = Array.from(message.attachments.values());
        }
      });
      split(str, channel, files);
    }
    else {
      const hasContent = message.content.length > 0;
      str = `人: ${message.author.tag} ,\n${hasContent ? ' 訊息: ' + message.content + ' ,' : ''} \n 群: ${message.guild.name} , 貼圖： ${sticurl} ,\n 頻道: ${message.channel.name}`; 
      split(str, channel);
    }
    let type = 0;
  }
  // if it has attachments (image/video/document....)
  else if (message.attachments.size > 0) {
    message.attachments.forEach(attachment => {
      const hasContent = message.content.length > 0;
      const attachmentText = attachment.size > 10485760 ? `, \n 附件: ${attachment.url}` : ', \n 附件:';
      const str = `人: ${message.author.tag} ,\n${hasContent ? ' 訊息: ' + message.content + ' ,' : ''} \n 群: ${message.guild.name} , 貼圖： ${sticurl} ,\n 頻道: ${message.channel.name}${attachmentText}`;
      if (attachment.size <= 10485760) {
        const files = Array.from(message.attachments.values());
        split(str, channel, files);
      } else {
        split(str, channel);
      }
    });
  }
  // if it have embed
  else if (message.embeds[0]) {
    const receivedEmbed = message.embeds[0];
    const hasContent = message.content.length > 0;
    let type = hasContent ? 3 : 4;
    const str = `人: ${message.author.tag} ,\n 群: ${message.guild.name} ,\n 頻道: ${message.channel.name} ${hasContent ? `,\n 内容： ${message.content}` : ''} ,\n embed:`;
    embed(str, channel, receivedEmbed);
}
  // if it was a reply
  else if (message.reference?.messageId) {
    tries++;
    const repliedTo = await message.channel.messages.fetch(message.reference.messageId);
    let type = 5;
    const str = `前文(?: ${repliedTo.author.tag}\n 内容：${repliedTo.content} \n ======================================== \n 人:${message.author.tag} , 訊息: ${message.content} ,\n 群:${message.guild.name} ,\n 頻道:${message.channel.name}`;
    split(str, channel);
}
  // normal message
  else {
    var str = `人:${message.author.tag},\n 訊息: ${message.content} ,\n 群:${message.guild.name} ,\n 頻道:${message.channel.name}`, type = 6;
    split(str, channel)
  }
}

