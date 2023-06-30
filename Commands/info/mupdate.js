const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/roles.sqlite" });

module.exports = {
  name: "mupdate",
  aliases: ["m"],
  description: 'log roles changes',
  run: async (client, oldMember, newMember, trans, langc) => {
    if (!db.get(newMember.user.id)) {
      newMember.roles.cache.forEach(async role => {
        await db.push(newMember.user.id, role.id);
      });
    }

    const log = newMember.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'log');
    if (!log) return;

    const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
    if (removedRoles.size) {
      const roleNames = removedRoles.map(r => r.name).toString();
      if (roleNames.length) {
        db.pull(newMember.user.id, removedRoles.map(r => r.id));
        const newr = `${oldMember.displayName} 不再是 ${roleNames} 了`;
        log.send(`身份組變了欸~\n\n${newr}`);
      }
    }

    const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
    if (addedRoles.size) {
      const roleNames = addedRoles.map(r => r.name).toString();
      if (roleNames.length) {
        db.push(newMember.user.id, addedRoles.map(r => r.id));
        const rmr = `${oldMember.displayName} 現在是 ${roleNames} 了`;
        log.send(`身份組變了欸~\n\n${rmr}`);
      }
    }
  }
}
