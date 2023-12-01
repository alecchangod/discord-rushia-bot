// Imports the client library
const client = require("../../index.js");
const fs = require("fs");
const secret = require("../../config.json");
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });

//new member
client.on("guildMemberAdd", async (member) => {
  const cmd = "joined";
  let command = client.info.get(cmd);
  if (!command) command = client.info.get(client.aliases.get(cmd));
  // Get language code from database or use server's one
  var langc =
    (await db.get(`lang_${member.guild.id}`)) || member.guild.preferredLocale;
    let trans_name = cmd;

    let file_exist = fs.existsSync(`trans/${langc}/${trans_name}.json`);
  
    let trans = file_exist
      ? require(`../../trans/${langc}/${trans_name}.json`)
      : require(`../../trans/en-US/${trans_name}.json`);
  
    var b_langc = secret.bot_lang;
  
    let b_file_exist = fs.existsSync(`trans/${b_langc}/${trans_name}.json`);
  
    let b_trans = b_file_exist
      ? require(`../../trans/${b_langc}/${trans_name}.json`)
      : require(`../../trans/en-US/${trans_name}.json`);
  if (command) command.run(client, secret, member, trans, b_trans);
});
