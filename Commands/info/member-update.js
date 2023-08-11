const { QuickDB } = require("quick.db");
const member = new QuickDB({ filePath: "database/members.sqlite" });

module.exports = {
  name: "Member Updates",
  aliases: ["member-update"],
  description: 'log member changes',
  run: async (client, oldMember, newMember, secret, trans, b_trans) => {
    // Check if was saved at database
    const rolehasRecord = await member.get(`${newMember.guild.id}_roles_${newMember.user.id}`);
    const namehasRecord = await member.get(`${newMember.guild.id}_${newMember.user.id}`);

    // Few logging channels
    const newrecord = await client.channels.fetch(secret.newrecord_log_channel)
    const rolelog = await client.channels.fetch(secret.role_log_channel)
    const usernamelog = await client.channels.fetch(secret.username_log_channel)

    // Get translations
    const adding = b_trans.strings.find(it => it.name === "adding").trans;
    const b_m_add = b_trans.strings.find(it => it.name === "m_add").trans;
    const b_m_rm = b_trans.strings.find(it => it.name === "m_rm").trans;
    const added = b_trans.strings.find(it => it.name === "added").trans;
    const b_r_changed = b_trans.strings.find(it => it.name === "r_changed").trans;
    const b_now_is = b_trans.strings.find(it => it.name === "now_is").trans;
    const b_u_change = b_trans.strings.find(it => it.name === "u_change").trans;

    const m_add = trans.strings.find(it => it.name === "m_add").trans;
    const m_rm = trans.strings.find(it => it.name === "m_rm").trans;
    const r_changed = trans.strings.find(it => it.name === "r_changed").trans;
    const now_is = trans.strings.find(it => it.name === "now_is").trans;
    const u_change = trans.strings.find(it => it.name === "u_change").trans;


    // Save if not yet saved
    if ((!rolehasRecord) && (newMember.guild.id)) {
      newrecord.send(`${newMember.guild.name}(${newMember.guild.id})\n ${newMember.user.tag} ${adding}`);
      newMember.roles.cache.forEach(async role => {
        if (((!rolehasRecord) || (!JSON.stringify(rolehasRecord).includes(role.id)))) {
          (async () => {
            await member.push(`${newMember.guild.id}_roles_${newMember.user.id}`, role.id);
            newrecord.send(`${newMember.guild.name}(${newMember.guild.id})\n${newMember.user.tag} ${b_m_add} ${role.name}`);
          })();
        }
      });
      newrecord.send(`${newMember.guild.name}(${newMember.guild.id})\n${newMember.user.tag} ${added}`);
    }
    // Find log channel
    const log = newMember.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'log');
    // Check for roles changes
    // Removal
    const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
    if (removedRoles.size) {
      const roleNames = removedRoles.map(r => r.name).toString();
      if (roleNames.length) {
        await member.pull(`${newMember.guild.id}_roles_${newMember.user.id}`, removedRoles.map(r => r.id));
        const newr = `${newMember.user.tag} ${m_rm} ${roleNames}`;
        const b_newr = `${newMember.user.tag} ${b_m_rm} ${roleNames}`;
        rolelog.send(`**${b_r_changed}**\n\n${newMember.guild.name}(${newMember.guild.id})\n ${b_newr}`)
        if (log) log.send(`**${r_changed}**\n\n${newr}`);
      }
    }
    // Addition
    const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
    if (addedRoles.size) {
      const roleNames = addedRoles.map(r => r.name).toString();
      if (roleNames.length) {
        await member.push(`${newMember.guild.id}_roles_${newMember.user.id}`, addedRoles.map(r => r.id));
        const rmr = `${newMember.user.tag} ${m_add} ${roleNames}`;
        const b_rmr = `${newMember.user.tag} ${b_m_add} ${roleNames}`;
        rolelog.send(`**${b_r_changed}**\n\n${newMember.guild.name}(${newMember.guild.id})\n ${b_rmr}`)
        if (log) log.send(`**${r_changed}**\n\n${rmr}`);
      }
    }

    // Check for name changes and save new username
    // Username changes
    if ((newMember.user.tag) && (oldMember.user.tag != newMember.user.tag)) {
      const authorTag = `${newMember.user.discriminator === '0' ? "@" : ""}${newMember.user.username}${newMember.user.discriminator === '0' ? "" : `#${newMember.user.discriminator}`}`;
      (async () => {
        await member.set(`${newMember.guild.id}_${newMember.user.id}`, authorTag);
      })();
      const name = `${namehasRecord} ${now_is} ${authorTag}`;
      const b_name = `${namehasRecord} ${b_now_is} ${authorTag}`;
      // Only send message when really changed name
      if ((namehasRecord != authorTag)) {
        usernamelog.send(`**${b_u_change}**\n\n${newMember.guild.name}(${newMember.guild.id})\n ${b_name}`)
        if (log) log.send(`**${u_change}**\n\n${name}`)
      }
    }
    // Display name changes
    const authorTag = `${newMember.user.discriminator === '0' ? "@" : ""}${newMember.displayName}${newMember.user.discriminator === '0' ? "" : `#${newMember.user.discriminator}`}`;
    if ((newMember.displayName) || (namehasRecord != authorTag)) {
      (async () => {
        await member.set(`${newMember.guild.id}_${newMember.user.id}`, authorTag);
      })();
      const name = `${namehasRecord} ${now_is} ${authorTag}`;
      const b_name = `${namehasRecord} ${b_now_is} ${authorTag}`;
      // Only send message when really changed name
      if ((namehasRecord != authorTag)) {
        usernamelog.send(`**${b_u_change}**\n\n${newMember.guild.name}(${newMember.guild.id})\n ${b_name}`)
        if (log) log.send(`**${u_change}**\n\n${name}`)
      }
    }
  }
}
