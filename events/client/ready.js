// Imports the client libraries
const client = require('../../index.js');
const secret = require('../../config.json');
const cron = require('cron');

// Define function
// Schedule Messages
function startScheduledMessage(time, server, channelid, contents) {
  let scheduledMessage = new cron.CronJob(time, () => {
    const guild = client.guilds.cache.get(server);
    const channel = guild.channels.cache.get(channelid);
    channel.send(contents);
  });
  scheduledMessage.start();
}
// Self-role
async function handleSelfRole(guildid, channel, messageid, reaction) {
  const sr_log = await client.channels.fetch(secret.self_role_log_channel);
  const guild = client.guilds.cache.get(guildid);
  const message = await guild.channels.cache.get(channel).messages.fetch(messageid);
  message.react(reaction);
  const reaction_name = reaction.split("<:")[1].split(":")[0];
  const collector = message.createReactionCollector({ 
    filter: (reaction, user) => reaction.emoji.name === reaction_name && !user.bot 
  });
  collector.on('collect', async (reaction, user) => {
    const link = `https://discord.com/channels/${reaction.message.guildId}/${reaction.message.channelId}/${reaction.message.id}`;
    const role = guild.roles.cache.get('964140235401355304');
    const member = guild.members.cache.get(user.id);
    if (member.roles.cache.has(role.id)) {
      await member.roles.remove(role);
      reaction.users.remove(user.id);
      sr_log.send(`**Self-role**\n\n${link}\nRemoved role \`\`${role.name}\`\` from \`\`${user.tag}\`\``);
    } else {
      await member.roles.add(role);
      reaction.users.remove(user.id);
      sr_log.send(`**Self-role**\n\n${link}\nAdded role \`\`${role.name}\`\` to \`\`${user.tag}\`\``);
    }
  });
}

// Ready
client.on('ready', async () => {
  // Rushia is now online!
  let str = `${client.user.tag} is ready on ${client.guilds.cache.size} servers.`
  console.log(str);
  // Online logging
  const log = await client.channels.fetch(secret.online_log_channel);
  str += `\n\`\`\``;
  // Show which group Rushia was in
  client.guilds.cache.forEach(guild => {
    let channel = `${guild.name}(${guild.id}), ${guild.memberCount} users, ${guild.roles.cache.size} roles, ${guild.channels.cache.size} channels`;
    console.log(channel);
    str += `\n${channel}`;
  });
  // Send to log channel
  log.send(`**${client.user.tag} was now online!** \n<t:${Math.floor(Date.now() / 1000)}>\n\n${str}\`\`\``);
  // Set status
  client.user.setPresence({ activities: [{ name: "誰在做夢", type: 3 }], status: 'idle', clientStatus: "PS5" });
  // Start schedule messages
  startScheduledMessage("00 00 12 * * *", secret.grp2, secret.channelID2, "你各位別當死魚堆");
  // Start to handle self-role
  await handleSelfRole("949153367609987124", "963802334482284595", "963802394045583370", "<:makaneko_surprise:958407417559908382>");
});
