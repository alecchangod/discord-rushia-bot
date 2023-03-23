const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/roles.sqlite" });
module.exports = {
  name: "mupdate",
  aliases: ["m"],
  description: 'log roles changes',
  run: async (client, oldMember, newMember, trans, langc) => {

    const oldr = await db.get(newMember.user.id)
    if (oldr === null || oldr === undefined) {
      const r = newMember.roles.cache
      r.forEach(async r => {
        await db.push(newMember.user.id, r.id)
      })
    }

    //role(s) were removed
    const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
    if (removedRoles.size > 0) {
      console.log(removedRoles.map(r => r.name).toString())
      if ((removedRoles.map(r => r.name).toString().length === 0) || (!removedRoles.map(r => r.name))) return;
      db.pull(newMember.user.id, removedRoles.map(r => r.id));
      const newr = (`${oldMember.displayName} 不再是 ${removedRoles.map(r => r.name)} 了`);
      const Embed = (`身份組變了欸~\n\n${newr}`)
      let rolelog = newMember.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'log');
      if (!rolelog) return;
      rolelog.send(Embed);;
    }

    //role(s) were added
    const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
    if (addedRoles.size > 0) {
      console.log(addedRoles.map(r => r.name).toString())
      if ((!addedRoles.map(r => r.name)) || (addedRoles.map(r => r.name).toString().length === 0)) return;
      db.push(newMember.user.id, addedRoles.map(r => r.id));
      var rmr = `${oldMember.displayName} 現在是 ${addedRoles.map(r => r.name)} 了`
      const Embed1 = (`身份組變了欸~\n\n${rmr}`)
      let log = newMember.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'log');
      if (!log) return;
      log.send(Embed1);
    }
  }
}