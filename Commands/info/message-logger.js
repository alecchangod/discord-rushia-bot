const { EmbedBuilder } = require("@discordjs/builders");
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/messages.sqlite" });
const member = new QuickDB({ filePath: "database/members.sqlite" });
const fetch = require("node-fetch");
const fs = require("fs");
const split = require("../../function/common/split.js");

module.exports = {
  name: "Message logger",
  aliases: ["message-logger"],
  description: "Log message sent in server (owner only for now)",
  run: async (client, message, secret, trans) => {
    try {
      if (message.channel.parent?.id === "963763737683181568") return;
      const channel = await client.channels.fetch(secret.message_log_channel);
      const messageContent = message.content;
      const hasContent = messageContent.length > 0;
      let hasParent = message.channel.parent;
      let files, rfiles, receivedEmbed;
      // Get translations
      const file_t = trans.strings.find((it) => it.name === "file").trans;
      const p_msg = trans.strings.find((it) => it.name === "p_msg").trans;
      const cont = trans.strings.find((it) => it.name === "cont").trans;
      const sti_t = trans.strings.find((it) => it.name === "sti_t").trans;
      const server = trans.strings.find((it) => it.name === "server").trans;
      const parent = trans.strings.find((it) => it.name === "parent").trans;
      const ch = trans.strings.find((it) => it.name === "channel").trans;
      const em = trans.strings.find((it) => it.name === "embed").trans;
      const u = trans.strings.find((it) => it.name === "user").trans;

      // Start logging
      let author;
      if (!message.webhookId)
        author = await message.guild.members.fetch(message.author.id);
      let uname = author?.nickname || message.author.displayName;

      var str = `${server}: ${message.guild.name} (${message.guild.id}) ${
        hasParent ? `\n${parent}: ${message.channel.parent.name}` : ""
      }\n${ch}: ${message.channel.name} (${message.channel.id})\n`;

      const authorTag = `${
        message.author.discriminator === "0" ? "@" : ""
      }${uname}${
        message.author.discriminator === "0"
          ? ""
          : `#${message.author.discriminator}`
      }`;
      const author_Username = `${
        message.author.discriminator === "0" ? "@" : ""
      }${message.author.username}${
        message.author.discriminator === "0"
          ? ""
          : `#${message.author.discriminator}`
      }`;
      let authorname = await member.get(
        `${message.guild.id}_${message.author.id}`
      );
      if (!authorname || authorname != authorTag) {
        authorname = authorTag;
        await member.set(
          `${message.guild.id}_${message.author.id}`,
          authorname
        );
      }
      let authorusername = await member.get(`${message.author.id}_username`);
      if (!authorusername || authorusername != author_Username) {
        authorusername = author_Username;
        await member.set(`${message.author.id}_username`, authorusername);
      }

      // Is reply?
      if (message.reference?.messageId) {
        const repliedTo = await fetchRepliedMessage(message);
        if (repliedTo) {
          let rauthor;
          if (!repliedTo.webhookId)
            rauthor = await message.guild.members.fetch(repliedTo.author.id);
          let runame = rauthor?.nickname || repliedTo.author.displayName;

          const r_authorTag = `${
            repliedTo.author.discriminator === "0" ? "@" : ""
          }${runame}${
            repliedTo.author.discriminator === "0"
              ? ""
              : `#${repliedTo.author.discriminator}`
          }`;
          const r_author_Username = `${
            repliedTo.author.discriminator === "0" ? "@" : ""
          }${repliedTo.author.username}${
            repliedTo.author.discriminator === "0"
              ? ""
              : `#${repliedTo.author.discriminator}`
          }`;
          let r_authorname = await member.get(
            `${message.guild.id}_${repliedTo.author.id}`
          );
          if (!r_authorname || r_authorname != r_authorTag) {
            r_authorname = r_authorTag;
            await member.set(
              `${message.guild.id}_${repliedTo.author.id}`,
              r_authorname
            );
          }
          let r_authorusername = await member.get(
            `${repliedTo.author.id}_username`
          );
          if (!r_authorusername || r_authorusername != r_author_Username) {
            r_authorusername = r_author_Username;
            await member.set(
              `${repliedTo.author.id}_username`,
              r_authorusername
            );
          }

          str += `${p_msg}: ${r_authorTag} (<@${repliedTo.author.id}> / ${r_author_Username})\n`;

          const rhasContent = repliedTo.content.length > 0;
          str += rhasContent ? `${cont}: ${repliedTo.content}\n` : "";

          if (repliedTo.stickers.size > 0) {
            const ext = "png";
            const sck = repliedTo.stickers.first();
            const sticurl = `https://cdn.discordapp.com/stickers/${sck.id}.${ext}`;
            str += `${sti_t}: ${sticurl}\n`;
          }
          if (repliedTo.attachments.size > 0) {
            let size = 0;
            repliedTo.attachments.forEach((attachments) => {
              size += attachments.size;
            });
            str += `${file_t}:\n`;
            if (size <= 26214400) {
              rfiles = repliedTo.attachments.values();
            } else
              repliedTo.attachments.forEach((attachments) => {
                str += `${attachments.url}\n`;
              });
          }
          if (repliedTo.embeds[0]) {
            receivedEmbed = repliedTo.embeds;
            str += `${em}:\n`;
          }

          str += `\n\n===================================\n\n`;
        }
      }

      str += `${u}: ${authorTag} (<@${message.author.id}> / ${author_Username})\n`;
      await db.set(`${message.id}_author`, message.author.id);

      if (hasContent) {
        str += `${cont}: ${messageContent}\n`;
        await db.set(`${message.id}_cont`, messageContent);
      }

      if (message.stickers.size > 0) {
        const ext = "png";
        const sck = message.stickers.first();
        const sticurl = `https://cdn.discordapp.com/stickers/${sck.id}.${ext}`;
        str += `${sti_t}: ${sticurl}\n`;
        await db.set(`${message.id}_sck`, sticurl);
      }
      if (message.attachments.size > 0) {
        let size = 0;
        message.attachments.forEach((attachments) => {
          size += attachments.size;
        });
        str += `${file_t}:\n`;
        if (size <= 26214400) {
          files = message.attachments.values();
          const dirName = `messages/${message.id}`;
          if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName);
          }

          message.attachments.forEach(async (attachments) => {
            const response = await fetch(attachments.url);
            // Split the file name and the extension
            let fileNameParts = attachments.name.split(".");
            let fileExtension = fileNameParts.pop();
            let fileName = fileNameParts.join(".");
            // Append a timestamp to the file name
            let newFileName = `${fileName}_${Date.now()}.${fileExtension}`;
            const filepath = `messages/${message.id}/${newFileName}`;
            const fileStream = fs.createWriteStream(filepath);
            response.body.pipe(fileStream);

            fileStream.on("finish", () => {
              fileStream.close();
            });

            await db.push(`${message.id}_file`, filepath);
          });
        } else {
          message.attachments.forEach((attachments) => {
            str += `${attachments.url}\n`;
          });
        }
      }
      if (message.embeds[0]) {
        receivedEmbed = message.embeds;
        str += `${em}:\n`;
        await db.set(`${message.id}_embed`, receivedEmbed);
      }

      let attachments1 = rfiles ? Array.from(rfiles) : [];
      let attachments2 = files ? Array.from(files) : [];
      files = attachments1.concat(attachments2);

      split(str, channel, files, receivedEmbed, true);
    } catch (e) {
      console.log(e);
    }
  },
};

async function fetchRepliedMessage(message) {
  try {
    return await message.channel.messages.fetch(message.reference.messageId);
  } catch (error) {
    return null;
  }
}
