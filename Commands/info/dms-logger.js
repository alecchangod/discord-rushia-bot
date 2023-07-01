module.exports = {
  name: "DMs message logger",
  aliases: ["dm-logger"],
  description: 'Log DMs messages',
  run: async (client, message, secret, trans, langc) => {
    const channel = await client.channels.fetch(secret.PMlog);
    const authorTag = message.author.tag;
    const messageContent = message.content;
    var str = `人: ${authorTag} (<@${message.author.id}>)`;
    var files = [];
    const hasContent = messageContent.length > 0;

    function split(str, channel, file) {
      var partsArr = str.match(/[\s\S]{1,1900}/g) || [];
      partsArr.forEach((part, i) => {
        const content = `${part} \nPart ${i + 1} / ${partsArr.length}`;
        channel.send(file ? content ? { content: `${content}, 檔案: `, files: Array.from(file) } : {content: `檔案: `, files: Array.from(file) } : content);
      });
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
