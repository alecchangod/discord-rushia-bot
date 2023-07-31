const { QuickDB } = require("quick.db");
const member = new QuickDB({ filePath: "database/members.sqlite" });

module.exports = {
  name: "Member Updates",
  aliases: ["member-update"],
  description: 'log member changes',
  run: async (client, oldMember, newMember, secret, trans, langc) => {
    // Check if was saved at database
    const rolehasRecord = await member.get(`${newMember.guild.id}_roles_${newMember.user.id}`);
    const namehasRecord = await member.get(`${newMember.guild.id}_${newMember.user.id}`);

    // Few logging channels
    const newrecord = await client.channels.fetch(secret.newrecord_log_channel)
    const rolelog = await client.channels.fetch(secret.role_log_channel)
    const usernamelog = await client.channels.fetch(secret.username_log_channel)

    // Save if not yet saved
    if ((!rolehasRecord) && (newMember.guild.id)) {
      newrecord.send(`${newMember.guild.name}(${newMember.guild.id})\n ${newMember.user.tag} adding to record`);
      newMember.roles.cache.forEach(async role => {
        if (((!rolehasRecord) || (!JSON.stringify(rolehasRecord).includes(role.id)))) {
          (async () => {
            await member.push(`${newMember.guild.id}_roles_${newMember.user.id}`, role.id);
            newrecord.send(`${newMember.guild.name}(${newMember.guild.id})\n ${newMember.user.tag} added to ${role.name}`);
          })();
        }
      });
      newrecord.send(`${newMember.guild.name}(${newMember.guild.id})\n ${newMember.user.tag} added to record`);
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
        const newr = `${newMember.user.tag} 不再是 ${roleNames} 了`;
        rolelog.send(`${newMember.guild.name}(${newMember.guild.id})\n ${newr}`)
        if (log) log.send(`**身份組變了欸~**\n\n${newr}`);
      }
    }
    // Addition
    const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
    if (addedRoles.size) {
      const roleNames = addedRoles.map(r => r.name).toString();
      if (roleNames.length) {
        await member.push(`${newMember.guild.id}_roles_${newMember.user.id}`, addedRoles.map(r => r.id));
        const rmr = `${newMember.user.tag} 現在是 ${roleNames} 了`;
        rolelog.send(`${newMember.guild.name}(${newMember.guild.id})\n ${rmr}`)
        if (log) log.send(`**身份組變了欸~**\n\n${rmr}`);
      }
    }

    // Check for name changes and save new username
    // Username changes
    if ((newMember.user.tag) && (oldMember.user.tag != newMember.user.tag)) {
      (async () => {
        await member.set(`${newMember.guild.id}_${newMember.user.id}`, newMember.user.tag);
      })();
      const name = `${namehasRecord} 現在是 ${newMember.user.tag} 了`;
      // Only send message when really changed name
      if ((namehasRecord != newMember.user.tag)) {
        usernamelog.send(`${newMember.guild.name}(${newMember.guild.id})\n ${name}`)
        if (log) log.send(`**Changed username**\n\n${name}`)
      }
    }
    // Display name changes
    if ((newMember.displayName) || (namehasRecord != `${newMember.displayName}#${newMember.user.discriminator}`)) {
      (async () => {
        await member.set(`${newMember.guild.id}_${newMember.user.id}`, `${newMember.displayName}#${newMember.user.discriminator}`);
      })();
      const name = `${namehasRecord} 現在是 ${newMember.displayName}#${newMember.user.discriminator} 了`;
      // Only send message when really changed name
      if ((namehasRecord != `${newMember.displayName}#${newMember.user.discriminator}`)) {
        usernamelog.send(`${newMember.guild.name}(${newMember.guild.id})\n ${name}`)
        if (log) log.send(`**Changed username**\n\n${name}`)
      }
    }
  }
}
