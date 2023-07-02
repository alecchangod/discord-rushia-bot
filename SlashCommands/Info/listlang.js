const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require("@discordjs/builders");
const { ApplicationCommandOptionType, ButtonStyle, Message, CommandInteraction } = require("discord.js");
const wait = require('node:timers/promises').setTimeout;
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });
const { translate } = require("@almeidx/translate");
const lang = require('../../lang.json');
module.exports = {
    data: {
      name: "listlangs",
      description: 'List all available languages',
    },
    
    async execute(client, interaction, args, secret, trans, langc, guild) {
        await interaction.reply({content: "loading...", ephemeral: true });
      try {
        async function split(str, channel) {
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
              await channel.send(content);
          
              partNumber++;
            }
          };
        let message = 'Available languages:\n';
        lang.forEach((l) => message += `${l.code} - ${l.name}\n`);
        split(message, interaction.channel);
        interaction.editReply("Language listing ended.")
        
      } catch (e) {
        console.log(e);
        await interaction.channel.send({ content: 'An error occurred while executing the command.'});
      }
    },
  };
