const { EmbedBuilder } = require("@discordjs/builders")
module.exports = {
  name: "Message delete logger",
  aliases: ["delete-logger"],
  description: 'Log all deleted message at "log" channel',
  run: async (client, message, secret, trans, b_trans) => {
    // Get user information
    const authorTag = `${message.author.discriminator === '0' ? "@" : ""}${message.author.username}${message.author.discriminator === '0' ? "" : `#${message.author.discriminator}`}`;
    // Send to the "log" channel
    const messageContent = message.content;
    const hasContent = messageContent.length > 0;
    let hasParent = message.channel.parent;
    var files = [];
    var receivedEmbed = [];
    // Get translations
    const b__deleted = b_trans.strings.find(it => it.name === "deleted").trans;
    const b_t_message = b_trans.strings.find(it => it.name === "message").trans;
    const b_was_deleted = b_trans.strings.find(it => it.name === "was_deleted").trans;
    const b_file_t = b_trans.strings.find(it => it.name === "file").trans;
    const b_p_msg = b_trans.strings.find(it => it.name === "p_msg").trans;
    const b_cont = b_trans.strings.find(it => it.name === "cont").trans;
    const b_sti_t = b_trans.strings.find(it => it.name === "sti_t").trans;
    const b_server = b_trans.strings.find(it => it.name === "server").trans;
    const b_parent = b_trans.strings.find(it => it.name === "parent").trans;
    const b_ch = b_trans.strings.find(it => it.name === "channel").trans;
    const b_em = b_trans.strings.find(it => it.name === "embed").trans;
    const b_u = b_trans.strings.find(it => it.name === "user").trans;

    const _deleted = trans.strings.find(it => it.name === "deleted").trans;
    const t_message = trans.strings.find(it => it.name === "message").trans;
    const was_deleted = trans.strings.find(it => it.name === "was_deleted").trans;
    const file_t = trans.strings.find(it => it.name === "file").trans;
    const p_msg = trans.strings.find(it => it.name === "p_msg").trans;
    const cont = trans.strings.find(it => it.name === "cont").trans;
    const sti_t = trans.strings.find(it => it.name === "sti_t").trans;
    const parent = trans.strings.find(it => it.name === "parent").trans;
    const ch = trans.strings.find(it => it.name === "channel").trans;
    const em = trans.strings.find(it => it.name === "embed").trans;
    const u = trans.strings.find(it => it.name === "user").trans;

    var b_str = `**${b__deleted}**\n${b_t_message}\n${b_server}: ${message.guild.name}${hasParent ? `\n${b_parent}: ${message.channel.parent.name}` : ''}\n${b_ch}: ${message.channel.name} (<#${message.channel.id}>) ${b_was_deleted}\n`;
    var str = `**${_deleted}**\n${t_message}${hasParent ? `\n${parent}: ${message.channel.parent.name}` : ''}\n${ch}: ${message.channel.name} (<#${message.channel.id}>) ${was_deleted}\n`;
    // Is reply?
    if (message.reference?.messageId) {
      const repliedTo = await fetchRepliedMessage(message);
      if (repliedTo) {
        const rauthorTag = `${repliedTo.author.discriminator === '0' ? "@" : ""}${repliedTo.author.username}${repliedTo.author.discriminator === '0' ? "" : `#${repliedTo.author.discriminator}`}`;
        b_str += `${b_p_msg}: ${rauthorTag} (<@${repliedTo.author.id}>)\n`;
        str += `${p_msg}: ${rauthorTag} (<@${repliedTo.author.id}>)\n`;
        const rhasContent = repliedTo.content.length > 0;
        b_str += rhasContent ? `${b_cont}: ${repliedTo.content}\n` : '';
        str += rhasContent ? `${cont}: ${repliedTo.content}\n` : '';

        if (repliedTo.stickers.size > 0) {
          const ext = "png";
          const sck = repliedTo.stickers.first();
          const sticurl = `https://cdn.discordapp.com/stickers/${sck.id}.${ext}`;
          b_str += `${b_sti_t}: ${sticurl}\n`;
          str += `${sti_t}: ${sticurl}\n`;

        }
        if (repliedTo.attachments.size > 0) {
          let size = 0;
          repliedTo.attachments.forEach(attachments => {
            size += attachments.size;
          });
          str += `${file_t}:\n`;
          if (size <= 10485760) {
            files = repliedTo.attachments.values();
          }
          else repliedTo.attachments.forEach(attachments => {
            str += `${attachments.url}\n`;
          })
        }
        if (repliedTo.embeds[0]) {
          receivedEmbed = repliedTo.embeds;
          b_str += `${b_em}:\n`
          str += `${em}:\n`
        }

        b_str += `\n\n===================================\n\n`;
        str += `\n\n===================================\n\n`;
      }
    }

    b_str += `${b_u}: ${authorTag} (<@${message.author.id}>)\n`;
    str += `${u}: ${authorTag} (<@${message.author.id}>)\n`;
    b_str += hasContent ? `${b_cont}: ${message.content}\n` : '';
    str += hasContent ? `${cont}: ${message.content}\n` : '';

    if (message.stickers.size > 0) {
      const ext = "png";
      const sck = message.stickers.first();
      const sticurl = `https://cdn.discordapp.com/stickers/${sck.id}.${ext}`;
      b_str += `${b_sti_t}: ${sticurl}\n`;
      str += `${sti_t}: ${sticurl}\n`;
    }
    if (message.attachments.size > 0) {
      let size = 0;
      message.attachments.forEach(attachments => {
        size += attachments.size;
      });
      str += `${file_t}:\n`;
      if (size <= 10485760) {
        files = message.attachments.values();
      }
      else message.attachments.forEach(attachments => {
        str += `${attachments.url}\n`;
      })
    }
    if (message.embeds[0]) {
      receivedEmbed = message.embeds;
      b_str += `${b_em}:\n`
      str += `${em}:\n`
    }

    client.channels.fetch(secret.delete_log_channel).then(log => {
      split(b_str, log, files, receivedEmbed);
    });

    // Don't log message deleted in the "log"
    if (message.channel.name.includes("log")) return;
    const log = message.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'log');
    if (log) split(str, log, files, receivedEmbed);
  }
}

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

async function fetchRepliedMessage(message) {
  try {
    return await message.channel.messages.fetch(message.reference.messageId);
  } catch (error) {
    return null;
  }
}