const { EmbedBuilder } = require("@discordjs/builders")
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/messages.sqlite" });
const member = new QuickDB({ filePath: "database/members.sqlite" });

module.exports = {
    name: "DMs edit logger",
    aliases: ["dms-edit-logger"],
    description: 'log messages edit in DMs',
    run: async (client, oldMessage, newMessage, secret, trans, b_trans) => {
        if (!oldMessage) var oldMessage = trans.strings.find(it => it.name === "not_recorded").trans;
        const log = await client.channels.fetch(secret.PMlog);
        const old_msg = b_trans.strings.find(it => it.name === "old_msg").trans;
        const new_msg = b_trans.strings.find(it => it.name === "new_msg").trans;

        // Get translations
        const user = b_trans.strings.find(it => it.name === "user").trans;
        const file_t = b_trans.strings.find(it => it.name === "file").trans;
        const sti_t = b_trans.strings.find(it => it.name === "sti_t").trans;
        const embed_t = b_trans.strings.find(it => it.name === "embed").trans;

        // Get saved message information and update them
        const omct_db = await db.get(`${newMessage.id}_cont`);
        if (newMessage.content) await db.set(`${newMessage.id}_cont`, newMessage.content);
        const sticurl = await db.get(`${newMessage.id}_sck`);
        let files;
        const file = await db.get(`${newMessage.id}_file`);
        if (file) {
            files = file.map(path => ({ attachment: path, name: path.split('/').pop() }));
        }
        const embed_db = await db.get(`${newMessage.id}_embed`);
        if (newMessage.embeds[0]) await db.set(`${newMessage.id}_embed`, newMessage.embeds);

        let authorid = await db.get(`${newMessage.id}_author`);
        if (!authorid) {
            authorid = newMessage.author.id;
            await db.set(`${newMessage.id}_author`, authorid);
        }
        let authorname = await member.get(`${authorid}`);
        let authortag = `${newMessage.author.discriminator === '0' ? "@" : ""}${newMessage.author.username}${newMessage.author.discriminator === '0' ? "" : `#${newMessage.author.discriminator}`}`;
        if ((!authorname) || (authorname != authortag)) {
            authorname = authortag;
            await member.set(`${authorid}`, authorname);
        }

        if (!newMessage ||
            (newMessage.content === omct_db && newMessage.embed === oldMessage?.embeds)) return;

        let omct = omct_db ? `\n${old_msg}: ${omct_db}\n` : "";
        let nmct = newMessage.content ? `\n${new_msg}: ${newMessage.content}\n` : "";

        nmct += sticurl ? `${sti_t}: ${sticurl}\n` : "";

        nmct += files ? `${file_t}:\n` : "";

        let logContent = `${user}: ${authorname} (<@${authorid}>)`;

        let oreceivedEmbed = embed_db;
        let nreceivedEmbed = await db.get(`${newMessage.id}_embed`);

        const oreceivedEmbedString = JSON.stringify(oreceivedEmbed);
        const nreceivedEmbedString = JSON.stringify(nreceivedEmbed);

        if (oreceivedEmbedString === nreceivedEmbedString) oreceivedEmbed = null, nreceivedEmbed = null;

        omct += oreceivedEmbed ? `${embed_t}:\n` : "";
        nmct += nreceivedEmbed ? `${embed_t}:\n` : "";

        let _;

        let str = `${logContent}\n`
        str += omct;
        str += `\n========================================\n`
        str += nmct;
        if (oreceivedEmbedString !== nreceivedEmbedString) {
            split(`${logContent} ${omct}`, log, _, oreceivedEmbed);
            split(`${logContent} ${nmct}`, log, files, nreceivedEmbed);
        }
        else split(str, log, files)
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
