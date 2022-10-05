const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require('discord.js");
const { ApplicationCommandOptionType, ButtonStyle } = require("discord.js")
module.exports = {
    name: "msgupdate",
    aliases: ["m"],
    run: async (client, oldMessage, newMessage, secret) => {
        if (!newMessage) return;
        if (newMessage.channel.id === secret.log_channel) return;
        if (newMessage.channel.id === secret.edit_log_channel) return;
        if (newMessage.content = oldMessage?.content) return;
        if (!oldMessage) var oldMessage = 'not recorded'
        client.channels.fetch(secret.edit_log_channel).then(log => {
            log.send(`群組： ${newMessage.guild.name} \n \n 頻道： ${newMessage.channel} \n \n 人：${newMessage.author.tag} \n \n 原信息： ${oldMessage} ,新信息： ${newMessage}`);
        })
        let channel = newMessage.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'log');
        if (!channel) return;
        channel.send(`頻道： ${newMessage.channel} \n \n 人：${newMessage.author.tag} 原信息： ${oldMessage} ,新信息： ${newMessage}`);
    }
}
