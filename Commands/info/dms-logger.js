module.exports = {
  name: "DMs message logger",
  aliases: ["dm-logger"],
  description: 'Log DMs messages',
  run: async (client, message, secret, trans, langc) => {
    const channel = await client.channels.fetch(secret.PMlog);
    const authorTag = `${message.author.discriminator === '0' ? "@" : ""}${message.author.username}${message.author.discriminator === '0' ? "" : `#${message.author.discriminator}`}`;
    const messageContent = message.content;
    var str = `${authorTag} (<@${message.author.id}>)`;
    var files = [];
    const hasContent = messageContent.length > 0;
    function split(str, channel, file) {
      let startPos = 0;
      let partNumber = 1;
      let totalParts = Math.ceil(str.length / 1850);
      while (startPos < str.length) {
        let endPos = startPos + 1900;
        if (endPos < str.length) {
          const lastSpacePos = str.lastIndexOf(' ', endPos);
          const lastNewLinePos = str.lastIndexOf('\n', endPos);
          endPos = Math.max(lastSpacePos, lastNewLinePos);
        }
        const part = str.substring(startPos, endPos);
        startPos = endPos + 1;
    
        const content = `${part} \nPart ${partNumber} / ${totalParts}`;
        channel.send(file ? content ? { content: `${content}, 檔案: `, files: Array.from(file) } : {content: `檔案: `, files: Array.from(file) } : content);
      
        partNumber++;
      }
    };


    if (message.stickers.size > 0) {
      const ext = "png";
      const sck = message.stickers.first();
      const sticurl = `https://cdn.discordapp.com/stickers/${sck.id}.${ext}`;
      str += hasContent ? `, \n 訊息: ${messageContent}` : '';
      str += `, 貼圖： ${sticurl}`;

      if (message.attachments.size > 0) {
        message.attachments.forEach(attachment => {
          const attachmentText = attachment.size > 10485760 ? `, \n 附件: ${attachment.url}` : ', \n 附件:';
          str += attachmentText;
          if (attachment.size <= 10485760) {
            files = message.attachments.values();
          }
        });
      }
      split(str, channel, files);
    } else if (message.attachments.size > 0) {
      message.attachments.forEach(attachment => {
        str += hasContent ? `, \n 訊息: ${messageContent}` : '';
        str += attachment.size > 10485760 ? `, \n 附件: ${attachment.url}` : ', \n 附件:';
        if (attachment.size <= 10485760) {
          files = message.attachments.values();
        }
        split(str, channel, files);
      });
    } else if (message.reference?.messageId) {
      const repliedTo = await message.channel.messages.fetch(message.reference.messageId);
      str += `,\n 訊息: ${messageContent}\n\n =================================== \n\n 前文: ${repliedTo.author.tag}\n 内容：${repliedTo.content}`;
      split(str, channel);
    } else {
      str += `, \n 訊息: ${messageContent}`;
      split(str, channel);
    }
  }
};
