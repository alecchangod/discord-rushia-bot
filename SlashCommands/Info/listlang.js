const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require("@discordjs/builders");
const { ApplicationCommandOptionType, ButtonStyle } = require("discord.js");
const wait = require('node:timers/promises').setTimeout;
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });
const { translate } = require("@almeidx/translate");
const lang = require('../../lang.json');
module.exports = {
    data: {
      name: "listlang",
      description: 'List all supported languages',
      trans: "listlang"
    },
    
    async execute(client, interaction, args, secret, trans) {
      const loading = trans.strings.find(it => it.name === "loading").trans;
        await interaction.reply({content: loading, ephemeral: true });
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
          const available_lang = trans.strings.find(it => it.name === "available_lang").trans;
        let message = `${available_lang}:\n`;
        lang.forEach((l) => message += `${l.code} - ${l.name}\n`);
        split(message, interaction.channel);
        const ended = trans.strings.find(it => it.name === "ended").trans;
        interaction.editReply(ended)
        
      } catch (e) {
        console.log(e);
        await interaction.channel.send({ content: 'An error occurred while executing the command.'});
      }
    },
  };
