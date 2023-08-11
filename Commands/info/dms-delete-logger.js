const { EmbedBuilder } = require("@discordjs/builders")
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/messages.sqlite" });
const member = new QuickDB({ filePath: "database/members.sqlite" });

module.exports = {
    name: "DMs message delete logger",
    aliases: ["dms-delete-logger"],
    description: 'Log messages deleted in DMs',
    run: async (client, message, secret, trans, b_trans, langc) => {
        let channel = await client.channels.fetch(secret.PMlog);
        let files, rfiles, receivedEmbed;
        // Get translations
        const _deleted = b_trans.strings.find(it => it.name === "deleted").trans;
        const file_t = b_trans.strings.find(it => it.name === "file").trans;
        const p_msg = b_trans.strings.find(it => it.name === "p_msg").trans;
        const cont = b_trans.strings.find(it => it.name === "cont").trans;
        const sti_t = b_trans.strings.find(it => it.name === "sti_t").trans;
        const em = b_trans.strings.find(it => it.name === "embed").trans;
        const u = b_trans.strings.find(it => it.name === "user").trans;

        var str = `**${_deleted}**\n\n`;
        // Is reply?
        if (message.reference?.messageId) {
            const repliedTo = await fetchRepliedMessage(message);
            if (repliedTo) {
                const rauthorTag = `${repliedTo.author.discriminator === '0' ? "@" : ""}${repliedTo.author.username}${repliedTo.author.discriminator === '0' ? "" : `#${repliedTo.author.discriminator}`}`;
                str += `${p_msg}: ${rauthorTag} (<@${repliedTo.author.id}>)\n`;
                const rhasContent = repliedTo.content.length > 0;
                str += rhasContent ? `${cont}: ${repliedTo.content}\n` : '';

                if (repliedTo.stickers.size > 0) {
                    const ext = "png";
                    const sck = repliedTo.stickers.first();
                    const sticurl = `https://cdn.discordapp.com/stickers/${sck.id}.${ext}`;
                    str += `${sti_t}: ${sticurl}\n`;

                }
                if (repliedTo.attachments.size > 0) {
                    let size = 0;
                    repliedTo.attachments.forEach(attachments => {
                        size += attachments.size;
                    });
                    str += `${file_t}:\n`;
                    if (size <= 26214400) {
                        rfiles = repliedTo.attachments.values();
                    }
                    else repliedTo.attachments.forEach(attachments => {
                        str += `${attachments.url}\n`;
                    })
                }
                if (repliedTo.embeds[0]) {
                    receivedEmbed = repliedTo.embeds;
                    str += `${em}:\n`
                }

                str += `\n\n===================================\n\n`;
            }
        }
        const authorid = await db.get(`${message.id}_author`);
        const authorname = await member.get(`${authorid}`);

        str += `${u}: ${authorname} (<@${authorid}>)\n`;

        const mct = await db.get(`${message.id}_cont`);

        str += mct ? `${cont}: ${mct}\n` : '';

        const sticurl = await db.get(`${message.id}_sck`);
        if (sticurl) {
            str += `${sti_t}: ${sticurl}\n`;
        }
        const file = await db.get(`${message.id}_file`);
        if (file) {
            str += `${file_t}:\n`;
            files = file.map(path => ({ attachment: path, name: path.split('/').pop() }));
        }
        const embed = await db.get(`${message.id}_embed`);
        if (embed) {
            receivedEmbed = embed;
            str += `${em}:\n`
        }

        let attachments1 = rfiles ? Array.from(rfiles) : [];
        let attachments2 = files ? Array.from(files) : [];
        files = attachments1.concat(attachments2);

        split(str, channel, files, receivedEmbed);
    }
}

function split(str, channel, file, embed) {
    const exampleEmbed = embed ? new EmbedBuilder(embed).setTitle('New title') : null;
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
        channel.send(embed ? (file ? { content: content, files: Array.from(file), embeds: embed } : { content: content, embeds: embed }) : (file ? { content: content, files: Array.from(file) } : content));
        partNumber++;
    }
};

async function fetchRepliedMessage(message) {
    try {
        return await message.channel.messages.fetch(message.reference.messageId);
    } catch (error) {
        return null;
    }
}