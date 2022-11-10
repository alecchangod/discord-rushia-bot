// const { QuickDB } = require("quick.db");
// const db = new QuickDB({ filePath: "database/roles.sqlite" });
module.exports = {
  name: "mupdate",
  aliases: ["m"],
  run: async (client, oldMember, newMember) => {

    // newMember.roles.cache.forEach(async r => {
    //   console.log(r.name, r.id)
    //   const oldr = await db.get(newMember.user.id)
    //   if(oldr === null || oldr === undefined) {db.push(newMember.id, r.id)}
    //   else if (JSON.stringify(oldr).includes(r.id) === false) { 
    //     db.push(newMember.id, r.id) 
    //     console.log(`${newMember.displayName} was added to ${r.name}`)
    //   }
    //   db.set(r.id, r.name)
    // });

    const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
    if (removedRoles.size > 0) {
      console.log(removedRoles.map(r => r.name).toString())
      if ((removedRoles.map(r => r.name).toString().length === 0) || (!removedRoles.map(r => r.name))) return;
      db.pull(newMember.displayName, removedRoles.map(r => r.id));
      const newr = (`${oldMember.displayName} 不再是 ${removedRoles.map(r => r.name)} 了`);
      console.log(newr);
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
      db.push(newMember.displayName, addedRoles.map(r => r.id));
      console.log(`${oldMember.displayName} 現在是 ${addedRoles.map(r => r.name)} 了`);
      const newr1 = (`${oldMember.displayName} 現在是 ${addedRoles.map(r => r.name)} 了`);
      const Embed1 = (`身份組變了欸~\n\n${newr1}`)
      let log = newMember.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'log');
      if (!log) return;
      log.send(Embed1);
    }
  }
}