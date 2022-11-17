const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const { ApplicationCommandOptionType, ButtonStyle } = require("discord.js")
module.exports = {
    name: "msgupdate",
    aliases: ["m"],
    run: async (client, oldMessage, newMessage, secret) => {
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
        if (newMessage.content === oldMessage?.content) return;
        if ((newMessage.embeds[0]) && (newMessage.embeds[0].description) && (oldMessage.embeds[0]) && (oldMessage.embeds[0].description) ) {
            if (newMessage.embed = oldMessage?.embed) return;
            const oreceivedEmbed = oldMessage.embeds[0];
            const nreceivedEmbed = newMessage.embeds[0];
            const exampleEmbed = new EmbedBuilder(oreceivedEmbed).setTitle('New title');
            client.channels.fetch(secret.edit_log_channel).then(log => {
                log.send({content: `頻道： ${newMessage.channel} \n 人：${newMessage.author.tag} 原embed： `, embeds: [oreceivedEmbed]});
                log.send({content: `頻道： ${newMessage.channel} \n 人：${newMessage.author.tag} 新embed： `, embeds: [nreceivedEmbed]});
            })
            let channel = newMessage.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'log');
            if (!channel) return;
            channel.send({content: `頻道： ${newMessage.channel} \n 人：${newMessage.author.tag} 原embed： `, embeds: [oreceivedEmbed]});
            channel.send({content: `頻道： ${newMessage.channel} \n 人：${newMessage.author.tag} 新embed： `, embeds: [nreceivedEmbed]});
          }
        else{
        if (!oldMessage) var oldMessage = 'not recorded'
        client.channels.fetch(secret.edit_log_channel).then(log => {
            var str = (`群組： ${newMessage.guild.name} \n  頻道： ${newMessage.channel} \n 人：${newMessage.author.tag} \n 原信息： ${oldMessage} ,\n 新信息： ${newMessage}`);
            split(str, log)
        })
        let channel = newMessage.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'log');
        if (!channel) return;
        var str = (`頻道： ${newMessage.channel} \n 人：${newMessage.author.tag} 原信息： ${oldMessage} ,\n 新信息： ${newMessage}`);
        split(str, channel)
    };
}
}
