module.exports = {
  name: "DMs message logger",
  aliases: ["dms-logger"],
  description: 'Log DMs messages',
  run: async (client, message, secret, trans) => {
    const channel = await client.channels.fetch(secret.PMlog);
    const authorTag = `${message.author.discriminator === '0' ? "@" : ""}${message.author.username}${message.author.discriminator === '0' ? "" : `#${message.author.discriminator}`}`;
    const messageContent = message.content;
    var str = `${authorTag} (<@${message.author.id}>)`;
    var files = [];
    var receivedEmbed = [];
    const hasContent = messageContent.length > 0;
    // Get translations
    const file_t = trans.strings.find(it => it.name === "file").trans;
    const p_msg = trans.strings.find(it => it.name === "p_msg").trans;
    const cont = trans.strings.find(it => it.name === "cont").trans;
    const sti_t = trans.strings.find(it => it.name === "sti_t").trans;
    const em = trans.strings.find(it => it.name === "embed").trans;
    const u = trans.strings.find(it => it.name === "user").trans;

    function split(str, channel, file, embed) {
      const exampleEmbed = embed ? new EmbedBuilder(embed).setTitle('New title') : null;
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
        channel.send(embed ? (file ? { content: content, files: Array.from(file), embeds: embed } : { content: content, embeds: embed }) : (file ? { content: content, files: Array.from(file) } : content));
        partNumber++;
      }
    };

    // Is reply?
    if (message.reference?.messageId) {
      const repliedTo = await message.channel.messages.fetch(message.reference.messageId);
      str += `${p_msg}: ${repliedTo.author.tag}\n`;
      const rhasContent = repliedTo.content.length > 0;
      str += rhasContent ? `\n${cont}: ${repliedTo.content}` : '';

      if (repliedTo.stickers.size > 0) {
        const ext = "png";
        const sck = repliedTo.stickers.first();
        const sticurl = `https://cdn.discordapp.com/stickers/${sck.id}.${ext}`;
        str += `\n,${sti_t}: ${sticurl}`;

      }
      if (repliedTo.attachments.size > 0) {
        let size = 0;
        repliedTo.attachments.forEach(attachments => {
          size += attachments.size;
        });
        str += size > 10485760 ? `,\n${file_t}: ${message.attachment.url}` : `,\n${file_t}:`;
        if (size <= 10485760) {
          files = repliedTo.attachments.values();
        }
      }
      if (repliedTo.embeds[0]) {
        receivedEmbed = repliedTo.embeds;
        str += `\n${em}:`
      }

      str += `\n\n===================================\n\n`;

      str += `${u}: ${authorTag} (<@${message.author.id}>)`;
      str += hasContent ? `\n${cont}: ${message.content}` : '';

      if (message.stickers.size > 0) {
        const ext = "png";
        const sck = message.stickers.first();
        const sticurl = `https://cdn.discordapp.com/stickers/${sck.id}.${ext}`;
        str += `\n,${sti_t}: ${sticurl}`;
      }
      if (message.attachments.size > 0) {
        let size = 0;
        message.attachments.forEach(attachments => {
          size += attachments.size;
        });
        str += size > 10485760 ? `,\n${file_t}: ${message.attachment.url}` : `,\n${file_t}:`;
        if (size <= 10485760) {
          files = message.attachments.values();
        }
      }
      if (message.embeds[0]) {
        receivedEmbed = message.embeds;
        str += `\n${em}:`
      }

    } else { // Normal message
      str += `${u}: ${authorTag} (<@${message.author.id}>)`;
      str += hasContent ? `\n${cont}: ${message.content}` : '';

      if (message.stickers.size > 0) {
        const ext = "png";
        const sck = message.stickers.first();
        const sticurl = `https://cdn.discordapp.com/stickers/${sck.id}.${ext}`;
        str += `\n,${sti_t}: ${sticurl}`;
      }
      if (message.attachments.size > 0) {
        let size = 0;
        message.attachments.forEach(attachments => {
          size += attachments.size;
        });
        str += size > 10485760 ? `,\n${file_t}: ${message.attachment.url}` : `,\n${file_t}:`;
        if (size <= 10485760) {
          files = message.attachments.values();
        }
      }
      if (message.embeds[0]) {
        receivedEmbed = message.embeds;
        str += `\n${em}:`
      }
    }
    split(str, channel, files, receivedEmbed);


  }
}
