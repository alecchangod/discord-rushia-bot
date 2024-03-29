const { EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/messages.sqlite" });
const member = new QuickDB({ filePath: "database/members.sqlite" });
const split = require("../../function/common/split.js");

module.exports = {
  name: "Message updates",
  aliases: ["message-update"],
  description: "Log messages changes",
  run: async (client, oldMessage, newMessage, secret, trans, b_trans) => {
    // Get translations
    const user = trans.strings.find((it) => it.name === "user").trans;
    const old_msg = trans.strings.find((it) => it.name === "old_msg").trans;
    const new_msg = trans.strings.find((it) => it.name === "new_msg").trans;
    const link_t = trans.strings.find((it) => it.name === "link_t").trans;
    const ch = b_trans.strings.find((it) => it.name === "channel").trans;
    const file_t = trans.strings.find((it) => it.name === "file").trans;
    const sti_t = trans.strings.find((it) => it.name === "sti_t").trans;
    const embed_t = trans.strings.find((it) => it.name === "embed").trans;

    const b_user = b_trans.strings.find((it) => it.name === "user").trans;
    const b_old_msg = b_trans.strings.find((it) => it.name === "old_msg").trans;
    const b_new_msg = b_trans.strings.find((it) => it.name === "new_msg").trans;
    const b_link_t = b_trans.strings.find((it) => it.name === "link_t").trans;
    const b_server = b_trans.strings.find((it) => it.name === "server").trans;
    const b_ch = b_trans.strings.find((it) => it.name === "channel").trans;
    const b_file_t = b_trans.strings.find((it) => it.name === "file").trans;
    const b_sti_t = b_trans.strings.find((it) => it.name === "sti_t").trans;
    const b_embed_t = b_trans.strings.find((it) => it.name === "embed").trans;

    // Get saved message information and update them
    const omct_db = await db.get(`${newMessage.id}_cont`);
    if (newMessage.content)
      await db.set(`${newMessage.id}_cont`, newMessage.content);
    const sticurl = await db.get(`${newMessage.id}_sck`);
    let files;
    const file = await db.get(`${newMessage.id}_file`);
    if (file) {
      files = file.map((path) => ({
        attachment: path,
        name: path.split("/").pop(),
      }));
    }
    const embed_db = await db.get(`${newMessage.id}_embed`);
    if (newMessage.embeds[0])
      await db.set(`${newMessage.id}_embed`, newMessage.embeds);

    let authorid = await db.get(`${newMessage.id}_author`);
    if (!authorid) {
      authorid = newMessage.author.id;
      await db.set(`${newMessage.id}_author`, authorid);
    }

    let author;
    if (!newMessage.webhookId)
      author = await newMessage.guild.members.fetch(newMessage.author.id);
    let uname = author?.nickname || newMessage.author.displayName;

    const authorTag = `${
      newMessage.author.discriminator === "0" ? "@" : ""
    }${uname}${
      newMessage.author.discriminator === "0"
        ? ""
        : `#${newMessage.author.discriminator}`
    }`;
    const author_Username = `${
      newMessage.author.discriminator === "0" ? "@" : ""
    }${newMessage.author.username}${
      newMessage.author.discriminator === "0"
        ? ""
        : `#${newMessage.author.discriminator}`
    }`;
    let authorname = await member.get(`${newMessage.guildId}_${authorid}`);
    if (!authorname || authorname != authorTag) {
      authorname = authorTag;
      await member.set(`${newMessage.guildId}_${authorid}`, authorname);
    }
    let authorusername = await member.get(`${newMessage.author.id}_username`);
    if (!authorusername || authorusername != author_Username) {
      authorusername = author_Username;
      await member.set(`${newMessage.author.id}_username`, authorusername);
    }

    if (
      !newMessage ||
      newMessage.channel.name.toLowerCase().includes("log") ||
      (newMessage.content === omct_db &&
        newMessage.embed === oldMessage?.embeds)
    )
      return;

    const link = `https://discord.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id}`;
    let omct = omct_db ? `\n${old_msg}: ${omct_db}\n` : "";
    let nmct = newMessage.content
      ? `\n${new_msg}: ${newMessage.content}\n`
      : "";
    let b_omct = omct_db ? `\n${b_old_msg}: ${omct_db}\n` : "";
    let b_nmct = newMessage.content
      ? `\n${b_new_msg}: ${newMessage.content}\n`
      : "";

    nmct += sticurl ? `${sti_t}: ${sticurl}\n` : "";
    b_nmct += sticurl ? `${b_sti_t}: ${sticurl}\n` : "";

    nmct += files ? `${file_t}:\n` : "";
    b_nmct += files ? `${b_file_t}:\n` : "";

    let logContent = `${ch}: ${newMessage.channel.name} (${newMessage.channel})\n`;
    logContent += `${user}: ${authorname} (<@${authorid}>)`;
    let b_logContent = `${b_server}: ${newMessage.guild.name} (${newMessage.guild.id}) \n${b_ch}: ${newMessage.channel.name} (${newMessage.channel.id})\n`;
    b_logContent += `${b_user}: ${authorname} (<@${authorid}>)`;
    let channel = newMessage.guild.channels.cache.find(
      (ch) => ch.name.toLowerCase() === "log"
    );

    let oreceivedEmbed = embed_db;
    let nreceivedEmbed = await db.get(`${newMessage.id}_embed`);

    const oreceivedEmbedString = JSON.stringify(oreceivedEmbed);
    const nreceivedEmbedString = JSON.stringify(nreceivedEmbed);

    if (oreceivedEmbedString === nreceivedEmbedString)
      (oreceivedEmbed = null), (nreceivedEmbed = null);

    omct += oreceivedEmbed ? `${embed_t}:\n` : "";
    b_omct += oreceivedEmbed ? `${b_embed_t}:\n` : "";
    nmct += nreceivedEmbed ? `${embed_t}:\n` : "";
    b_nmct += nreceivedEmbed ? `${b_embed_t}:\n` : "";

    let _;

    let str = `${link_t}: ${link}\n${logContent}\n`;
    str += omct;
    str += `\n========================================\n`;
    str += nmct;
    let b_str = `${b_link_t}: ${link}\n${b_logContent}\n`;
    b_str += b_omct;
    b_str += `\n========================================\n`;
    b_str += b_nmct;
    client.channels.fetch(secret.edit_log_channel).then((log) => {
      if (oreceivedEmbedString !== nreceivedEmbedString) {
        split(
          `${b_link_t}: ${link}\n${b_logContent} ${b_omct}`,
          log,
          _,
          oreceivedEmbed,
          true
        );
        split(
          `${b_link_t}: ${link}\n${b_logContent} ${b_nmct}`,
          log,
          files,
          nreceivedEmbed,
          true
        );
      } else split(b_str, log, files, _, true);
    });
    if (channel) {
      if (oreceivedEmbedString !== nreceivedEmbedString) {
        split(
          `${link_t}: ${link}\n${logContent} ${omct}`,
          channel,
          _,
          oreceivedEmbed,
          true
        );
        split(
          `${link_t}: ${link}\n${logContent} ${nmct}`,
          channel,
          files,
          nreceivedEmbed,
          true
        );
      } else split(str, channel, files, _, true);
    }
  },
};
