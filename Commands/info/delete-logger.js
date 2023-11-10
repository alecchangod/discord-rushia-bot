const { EmbedBuilder } = require("@discordjs/builders");
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/messages.sqlite" });
const member = new QuickDB({ filePath: "database/members.sqlite" });
const split = require("../../function/common/split.js");

module.exports = {
  name: "Message delete logger",
  aliases: ["delete-logger"],
  description: 'Log all deleted message at "log" channel',
  run: async (client, message, secret, trans, b_trans) => {
    let hasParent = message.channel.parent;
    let files, rfiles, receivedEmbed;
    // Get translations
    const b__deleted = b_trans.strings.find(
      (it) => it.name === "deleted"
    ).trans;
    const b_t_message = b_trans.strings.find(
      (it) => it.name === "message"
    ).trans;
    const b_was_deleted = b_trans.strings.find(
      (it) => it.name === "was_deleted"
    ).trans;
    const b_file_t = b_trans.strings.find((it) => it.name === "file").trans;
    const b_p_msg = b_trans.strings.find((it) => it.name === "p_msg").trans;
    const b_cont = b_trans.strings.find((it) => it.name === "cont").trans;
    const b_sti_t = b_trans.strings.find((it) => it.name === "sti_t").trans;
    const b_server = b_trans.strings.find((it) => it.name === "server").trans;
    const b_parent = b_trans.strings.find((it) => it.name === "parent").trans;
    const b_ch = b_trans.strings.find((it) => it.name === "channel").trans;
    const b_em = b_trans.strings.find((it) => it.name === "embed").trans;
    const b_u = b_trans.strings.find((it) => it.name === "user").trans;

    const _deleted = trans.strings.find((it) => it.name === "deleted").trans;
    const t_message = trans.strings.find((it) => it.name === "message").trans;
    const was_deleted = trans.strings.find(
      (it) => it.name === "was_deleted"
    ).trans;
    const file_t = trans.strings.find((it) => it.name === "file").trans;
    const p_msg = trans.strings.find((it) => it.name === "p_msg").trans;
    const cont = trans.strings.find((it) => it.name === "cont").trans;
    const sti_t = trans.strings.find((it) => it.name === "sti_t").trans;
    const parent = trans.strings.find((it) => it.name === "parent").trans;
    const ch = trans.strings.find((it) => it.name === "channel").trans;
    const em = trans.strings.find((it) => it.name === "embed").trans;
    const u = trans.strings.find((it) => it.name === "user").trans;

    var b_str = `**${b__deleted}**\n${b_t_message}\n${b_server}: ${
      message.guild.name
    }${
      hasParent ? `\n${b_parent}: ${message.channel.parent.name}` : ""
    }\n${b_ch}: ${message.channel.name} (<#${
      message.channel.id
    }>) ${b_was_deleted}\n`;
    var str = `**${_deleted}**\n${t_message}${
      hasParent ? `\n${parent}: ${message.channel.parent.name}` : ""
    }\n${ch}: ${message.channel.name} (<#${
      message.channel.id
    }>) ${was_deleted}\n`;
    // Is reply?
    if (message.reference?.messageId) {
      const repliedTo = await fetchRepliedMessage(message);
      if (repliedTo) {
        let rauthorname = await member.get(
          `${message.guildId}_${repliedTo.author.id}`
        );
        b_str += `${b_p_msg}: ${rauthorname} (<@${repliedTo.author.id}>)\n`;
        str += `${p_msg}: ${rauthorname} (<@${repliedTo.author.id}>)\n`;
        const rhasContent = repliedTo.content.length > 0;
        b_str += rhasContent ? `${b_cont}: ${repliedTo.content}\n` : "";
        str += rhasContent ? `${cont}: ${repliedTo.content}\n` : "";

        if (repliedTo.stickers.size > 0) {
          const ext = "png";
          const sck = repliedTo.stickers.first();
          const sticurl = `https://cdn.discordapp.com/stickers/${sck.id}.${ext}`;
          b_str += `${b_sti_t}: ${sticurl}\n`;
          str += `${sti_t}: ${sticurl}\n`;
        }
        if (repliedTo.attachments.size > 0) {
          let size = 0;
          repliedTo.attachments.forEach((attachments) => {
            size += attachments.size;
          });
          b_str += `${b_file_t}:\n`;
          str += `${file_t}:\n`;
          if (size <= 26214400) {
            rfiles = repliedTo.attachments.values();
          } else
            repliedTo.attachments.forEach((attachments) => {
              b_str += `${attachments.url}\n`;
              str += `${attachments.url}\n`;
            });
        }
        if (repliedTo.embeds[0]) {
          receivedEmbed = repliedTo.embeds;
          b_str += `${b_em}:\n`;
          str += `${em}:\n`;
        }

        b_str += `\n\n===================================\n\n`;
        str += `\n\n===================================\n\n`;
      }
    }
    const authorid = await db.get(`${message.id}_author`);
    const authorname = await member.get(`${message.guildId}_${authorid}`);

    b_str += `${b_u}: ${authorname} (<@${authorid}>)\n`;
    str += `${u}: ${authorname} (<@${authorid}>)\n`;

    const mct = await db.get(`${message.id}_cont`);

    b_str += mct ? `${b_cont}: ${mct}\n` : "";
    str += mct ? `${cont}: ${mct}\n` : "";

    const sticurl = await db.get(`${message.id}_sck`);
    if (sticurl) {
      b_str += `${b_sti_t}: ${sticurl}\n`;
      str += `${sti_t}: ${sticurl}\n`;
    }
    const file = await db.get(`${message.id}_file`);
    if (file) {
      b_str += `${b_file_t}:\n`;
      str += `${file_t}:\n`;
      files = file.map((path) => ({
        attachment: path,
        name: path.split("/").pop(),
      }));
    }
    const embed = await db.get(`${message.id}_embed`);
    if (embed) {
      receivedEmbed = embed;
      b_str += `${b_em}:\n`;
      str += `${em}:\n`;
    }

    let attachments1 = rfiles ? Array.from(rfiles) : [];
    let attachments2 = files ? Array.from(files) : [];
    files = attachments1.concat(attachments2);

    client.channels.fetch(secret.delete_log_channel).then((log) => {
      split(b_str, log, files, receivedEmbed);
    });

    // Don't log message deleted in the "log"
    if (message.channel.name.includes("log")) return;
    const log = message.guild.channels.cache.find(
      (ch) => ch.name.toLowerCase() === "log"
    );
    if (log) split(str, log, files, receivedEmbed);
  },
};

async function fetchRepliedMessage(message) {
  try {
    return await message.channel.messages.fetch(message.reference.messageId);
  } catch (error) {
    return null;
  }
}
