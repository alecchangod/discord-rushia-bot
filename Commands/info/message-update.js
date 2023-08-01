const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "Message updates",
  aliases: ["message-update"],
  description: 'Log messages changes',
  run: async (client, oldMessage, newMessage, secret, trans, b_trans) => {
    function split(str, channel) {
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
        channel.send(content);

        partNumber++;
      }
    };
    function embed(str, channel, embed) {
      var partsArr = str.match(/[\s\S]{1,1900}/g) || [];
      partsArr.forEach((part, i) => {
        const content = `${part} \nPart ${i + 1} / ${partsArr.length}`;
        channel.send(content ? { content, embeds: embed } : { embeds: embed });
      });
    };
    // Get translations
    const user = trans.strings.find(it => it.name === "user").trans;
    const old_msg = trans.strings.find(it => it.name === "old_msg").trans;
    const new_msg = trans.strings.find(it => it.name === "new_msg").trans;
    const link_t = trans.strings.find(it => it.name === "link_t").trans;
    const not_recorded = trans.strings.find(it => it.name === "not_recorded").trans;
    const ch = b_trans.strings.find(it => it.name === "channel").trans;
    const b_user = b_trans.strings.find(it => it.name === "user").trans;
    const b_old_msg = b_trans.strings.find(it => it.name === "old_msg").trans;
    const b_new_msg = b_trans.strings.find(it => it.name === "new_msg").trans;
    const b_link_t = b_trans.strings.find(it => it.name === "link_t").trans;
    const b_server = b_trans.strings.find(it => it.name === "server").trans;
    const b_not_recorded = b_trans.strings.find(it => it.name === "not_recorded").trans;
    const b_ch = b_trans.strings.find(it => it.name === "channel").trans;

    if (!newMessage || newMessage.channel.name.toLowerCase().includes("log") ||
      (newMessage.content === oldMessage?.content && newMessage.embed === oldMessage?.embeds)) return;

    const link = `https://discord.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id}`;
    const omct = oldMessage?.content ? `\n${old_msg}: ${oldMessage?.content}` : "";
    const nmct = newMessage.content ? `\n${new_msg}: ${newMessage.content}` : "";
    const b_omct = oldMessage?.content ? `\n${b_old_msg}: ${oldMessage?.content}` : "";
    const b_nmct = newMessage.content ? `\n${b_new_msg}: ${newMessage.content}` : "";

    let logContent = `${ch}: ${newMessage.channel}\n`
    logContent += `${user}: ${newMessage.author.discriminator === '0' ? "@" : ""}${newMessage.author.username}${newMessage.author.discriminator === '0' ? "" : `#${newMessage.author.discriminator}`}`;
    let b_logContent = `${b_server}: ${newMessage.guild.name} \n${b_ch}: ${newMessage.channel}\n`
    b_logContent += `${b_user}: ${newMessage.author.discriminator === '0' ? "@" : ""}${newMessage.author.username}${newMessage.author.discriminator === '0' ? "" : `#${newMessage.author.discriminator}`}`;
    let channel = newMessage.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'log');

    if (newMessage.embeds[0]?.description) {
      const oreceivedEmbed = oldMessage?.embeds;
      const nreceivedEmbed = newMessage.embeds;

      client.channels.fetch(secret.edit_log_channel).then(log => {
        embed(`${b_link_t}: ${link}${b_logContent} ${b_omct}`, log, oreceivedEmbed ? oreceivedEmbed : []);
        embed(`${b_link_t}: ${link}\n${b_logContent} ${b_nmct}`, log, nreceivedEmbed);
      });
      if (!channel) return;
      embed(`${link_t}: ${link}${logContent} ${omct}`, channel, oreceivedEmbed ? oreceivedEmbed : []);
      embed(`${link_t}: ${link}\n${logContent} ${nmct}`, channel, nreceivedEmbed);
    } else {
      let str = `${link_t}: ${link}\n${logContent}\n`
      str += `${old_msg}: ${oldMessage || not_recorded}`
      str += `\n========================================\n`
      str += `${new_msg}: ${newMessage}`;
      let b_str = `${b_link_t}: ${link}\n${b_logContent}\n`
      b_str += `${b_old_msg}: ${oldMessage || b_not_recorded}`
      b_str += `\n========================================\n`
      b_str += `${b_new_msg}: ${newMessage}`;
      client.channels.fetch(secret.edit_log_channel).then(log => split(b_str, log));
      if (channel) split(str, channel);
    };
  }
}