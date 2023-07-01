const { QuickDB } = require("quick.db");
const member = new QuickDB({ filePath: "database/members.sqlite" });

module.exports = {
  name: "Member Updates",
  aliases: ["member-update"],
  description: 'log member changes',
  run: async (client, oldMember, newMember, trans, langc) => {
    // Check if was saved at database
    const rolehasRecord = await member.get(`${newMember.guild.id}_roles_${newMember.user.id}`);
    const namehasRecord = await member.get(`${newMember.guild.id}_${newMember.user.id}`);
    // Save if not yet saved
    if (!rolehasRecord) {
      newMember.roles.cache.forEach(async role => {
        const hasrole = await member.get(`${newMember.guild.id}_roles_${newMember.user.id}`);
        if ((!hasrole) || (!hasrole.includes(role.id))) {
          (async () => {
            await member.push(`${newMember.guild.id}_roles_${newMember.user.id}`, role.id);
          })();
    }
  });
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
    const newr = `${oldMember.displayName} 不再是 ${roleNames} 了`;
    if (log) log.send(`**身份組變了欸~**\n\n${newr}`);
  }
}
// Addition
const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
if (addedRoles.size) {
  const roleNames = addedRoles.map(r => r.name).toString();
  if (roleNames.length) {
    await member.push(`${newMember.guild.id}_roles_${newMember.user.id}`, addedRoles.map(r => r.id));
    const rmr = `${oldMember.displayName} 現在是 ${roleNames} 了`;
    if (log) log.send(`**身份組變了欸~**\n\n${rmr}`);
  }
}

// Check for username changes
// Save new username
if ((!namehasRecord) || (namehasRecord != newMember.user.tag)) {
  (async () => {
    await member.set(`${newMember.guild.id}_${newMember.user.id}`, newMember.user.tag);
  })();
  const name = `${oldMember.user.tag} 現在是 ${newMember.user.tag} 了`;
  // Only send message when really changed name
  if ((log) && (oldMember.user.tag != newMember.user.tag)) log.send(`**Changed username**\n\n${name}`)
}
  }
}
