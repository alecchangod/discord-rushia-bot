const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
const { ApplicationCommandOptionType, ButtonStyle } = require("discord.js")
module.exports = {
    name: "msgupdate",
    aliases: ["m"],
    run: async (client, oldMessage, newMessage, secret) => {
        if (!newMessage) return;
        if (newMessage.channel.name.toLowerCase().includes("log")) return;
        if (newMessage.content === oldMessage?.content) return;
        if ((newMessage.embeds[0]) && (newMessage.embeds[0].description) && (oldMessage.embeds[0]) && (oldMessage.embeds[0].description) ) {
            if (newMessage.embed = oldMessage?.embed) return;
            const oreceivedEmbed = oldMessage.embeds[0];
            const nreceivedEmbed = newMessage.embeds[0];
            const exampleEmbed = new EmbedBuilder(oreceivedEmbed).setTitle('New title');
            client.channels.fetch(secret.edit_log_channel).then(log => {
                log.send({content: `頻道： ${newMessage.channel} \n \n 人：${newMessage.author.tag} 原embed： `, embeds: [oreceivedEmbed]});
                log.send({content: `頻道： ${newMessage.channel} \n \n 人：${newMessage.author.tag} 新embed： `, embeds: [nreceivedEmbed]});
            })
            let channel = newMessage.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'log');
            if (!channel) return;
            channel.send({content: `頻道： ${newMessage.channel} \n \n 人：${newMessage.author.tag} 原embed： `, embeds: [oreceivedEmbed]});
            channel.send({content: `頻道： ${newMessage.channel} \n \n 人：${newMessage.author.tag} 新embed： `, embeds: [nreceivedEmbed]});
          }
        else{
        if (!oldMessage) var oldMessage = 'not recorded'
        client.channels.fetch(secret.edit_log_channel).then(log => {
            log.send(`群組： ${newMessage.guild.name} \n \n 頻道： ${newMessage.channel} \n \n 人：${newMessage.author.tag} \n \n 原信息： ${oldMessage} ,新信息： ${newMessage}`);
        })
        let channel = newMessage.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'log');
        if (!channel) return;
        channel.send(`頻道： ${newMessage.channel} \n \n 人：${newMessage.author.tag} 原信息： ${oldMessage} ,新信息： ${newMessage}`);
    }
}
