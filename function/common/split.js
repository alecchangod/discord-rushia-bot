const { EmbedBuilder } = require("@discordjs/builders");
async function split(str, channel, file, embed, nomention) {
  const exampleEmbed = embed
    ? new EmbedBuilder(embed).setTitle("New title")
    : null;
  let startPos = 0;
  let partNumber = 1;
  let totalParts = Math.ceil(str.length / 1850);
  while (startPos < str.length) {
    let endPos = startPos + 1900;
    if (endPos < str.length) {
      const lastSpacePos = str.lastIndexOf(" ", endPos);
      const lastNewLinePos = str.lastIndexOf("\n", endPos);
      endPos = Math.max(lastSpacePos, lastNewLinePos);
    }
    const part = str.substring(startPos, endPos);
    startPos = endPos + 1;
    const content = `${part} \nPart ${partNumber} / ${totalParts}`;
    let messageOptions = {
      content: content,
    };

    // Don't mention user in the log
    if ((nomention = true)) messageOptions.allowedMentions = { parse: [] };

    if (partNumber === 1) {
      // Add embed if found
      if (embed) {
        messageOptions.embeds = embed;
      }
      // Add file if found
      if (file) {
        messageOptions.files = Array.from(file);
      }
    }
    // Send the message to the log
    channel.send(messageOptions);

    partNumber++;
  }
}

module.exports = split;
