module.exports = {
  name: "mupdate",
  aliases: ["m"],
  run: async (client, oldMember, newMember) => {
    const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
    if (removedRoles.size > 0) {
      const newr = (`${oldMember.displayName} 不再是 ${removedRoles.map(r => r.name)} 了`);
      console.log(newr);
      const Embed = (`身份組變了欸~\n\n${newr}`)
      let rolelog = newMember.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'log');
      if (!rolelog) return;
      rolelog.send(Embed);;
    } //i.e role(s) were added
    const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
    if (addedRoles.size > 0) {
      console.log(`${oldMember.displayName} 現在是 ${addedRoles.map(r => r.name)} 了`);
    }
    const newr1 = (`${oldMember.displayName} 現在是 ${addedRoles.map(r => r.name)} 了`);
    const Embed1 = (`身份組變了欸~\n\n${newr1}`)
    let log = newMember.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'log');
    if (!log) return;
    log.send(Embed1);;
  }
}