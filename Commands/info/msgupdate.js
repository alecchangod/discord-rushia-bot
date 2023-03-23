const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const { ApplicationCommandOptionType, ButtonStyle } = require("discord.js")
module.exports = {
  name: "msgupdate",
  aliases: ["m"],
  description: 'Log message changes',
  run: async (client, oldMessage, newMessage, secret, trans) => {
    // craete function
    function split(str, channel) {
      var partsArr = str.match(/[\s\S]{1,1900}/g) || [];
      if (partsArr.length > 1) {
        partsArr.forEach((partsArr, i) => channel.send(`${partsArr} \nPart ${i + 1} / ${partsArr.length}`));
      }
      else {
        channel.send(str);
      }
    }

    // define message type and log them
    if (!newMessage) return;
    if (newMessage.channel.name.toLowerCase().includes("log")) return;
    if ((newMessage.content === oldMessage?.content) && (newMessage.embed === oldMessage?.embeds)) return;
    var link = `https://discord.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id}`
    if (oldMessage?.content) var omct = `\n原信息： ${oldMessage?.content}`
    else var omct = "";
    if (newMessage.content) var nmct = `\n新信息： ${newMessage.content}`
    else var nmct = "";
    if ((newMessage.embeds[0]?.description)) { //  && (newMessage.embeds[0]) && (oldMessage.embeds[0]) && (oldMessage.embeds[0].description) 
      if ((newMessage.embed === oldMessage?.embed) && (newMessage.content === oldMessage?.content)) return;
      const oreceivedEmbed = oldMessage.embeds[0];
      const nreceivedEmbed = newMessage.embeds[0];
      const exampleEmbed = new EmbedBuilder(oreceivedEmbed).setTitle('New title');
      client.channels.fetch(secret.edit_log_channel).then(log => {
        if (oreceivedEmbed) { log.send({ content: `群組： ${newMessage.guild.name} \n頻道： ${newMessage.channel} \n人：${newMessage.author.tag} ${omct} \n原embed： `, embeds: [oreceivedEmbed] }) }
        else { log.send({ content: `群組： ${newMessage.guild.name} \n頻道： ${newMessage.channel} \n人：${newMessage.author.tag} ${omct}` }) };
        log.send({ content: `鏈接：${link}\n群組： ${newMessage.guild.name} \n頻道： ${newMessage.channel} \n人：${newMessage.author.tag} ${nmct}\n新embed： `, embeds: [nreceivedEmbed] });
      })
      let channel = newMessage.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'log');
      if (!channel) return;
      if (oreceivedEmbed) { channel.send({ content: `頻道： ${newMessage.channel} \n人：${newMessage.author.tag} ${omct}\n原embed： `, embeds: [oreceivedEmbed] }) }
      else { channel.send({ content: `頻道： ${newMessage.channel} \n人：${newMessage.author.tag} ${omct}` }) };
      channel.send({ content: `鏈接：${link}\n頻道： ${newMessage.channel} \n人：${newMessage.author.tag} ${nmct}\n新embed： `, embeds: [nreceivedEmbed] });
    }
    else {
      if (!oldMessage) var oldMessage = 'not recorded'
      client.channels.fetch(secret.edit_log_channel).then(log => {
        var str = (`鏈接：${link}\n群組： ${newMessage.guild.name} \n頻道： ${newMessage.channel} \n人：${newMessage.author.tag} \n原信息： ${oldMessage} \n======================================== \n新信息： ${newMessage}`);
        split(str, log)
      })
      let channel = newMessage.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'log');
      if (!channel) return;
      var str = (`鏈接：${link}\n頻道： ${newMessage.channel} \n人：${newMessage.author.tag} 原信息： ${oldMessage} \n======================================== \n新信息： ${newMessage}`);
      split(str, channel)
    };
  }
}
