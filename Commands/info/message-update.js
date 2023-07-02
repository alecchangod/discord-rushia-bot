const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "Message updates",
  aliases: ["message-update"],
  description: 'Log messages changes',
  run: async (client, oldMessage, newMessage, secret, trans, langc) => {
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

    if (!newMessage || newMessage.channel.name.toLowerCase().includes("log") ||
      (newMessage.content === oldMessage?.content && newMessage.embed === oldMessage?.embeds)) return;

    const link = `https://discord.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id}`;
    const omct = oldMessage?.content ? `\n原信息： ${oldMessage?.content}` : "";
    const nmct = newMessage.content ? `\n新信息： ${newMessage.content}` : "";

    const logContent = `群組： ${newMessage.guild.name} \n頻道： ${newMessage.channel} \n人：${newMessage.author.tag}`;
    let channel = newMessage.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'log');

    if (newMessage.embeds[0]?.description) {
      const oreceivedEmbed = oldMessage?.embeds;
      const nreceivedEmbed = newMessage.embeds;

      client.channels.fetch(secret.edit_log_channel).then(log => {
        embed(`${logContent} ${omct}`, log, oreceivedEmbed ? oreceivedEmbed : []);
        embed(`鏈接：${link}\n${logContent} ${nmct}`, log, nreceivedEmbed);
      });
      if (!channel) return;
      embed(`${logContent} ${omct}`, channel, oreceivedEmbed ? oreceivedEmbed : []);
      embed(`鏈接：${link}\n${logContent} ${nmct}`, channel, nreceivedEmbed);
    } else {
      const str = `鏈接：${link}\n${logContent} \n原信息： ${oldMessage || 'not recorded'} \n======================================== \n新信息： ${newMessage}`;
      client.channels.fetch(secret.edit_log_channel).then(log => split(str, log));
      if (channel) split(str, channel);
    };
  }
}