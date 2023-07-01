// Imports the client library
const client = require('../../index.js')
const secret = require('../../config.json')
const cron = require('cron');
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/group.sqlite" });

// start-up activities
client.on('ready', async () => {
  const log = await client.channels.fetch(secret.online_log_channel);
  console.log(`${client.user.tag} is ready on ${client.guilds.cache.size} servers.`);
  let str = `${client.user.tag} is ready on ${client.guilds.cache.size} servers.\n\`\`\``;
  client.guilds.cache.forEach(guild => {
    console.log(`${guild.name}(${guild.id}), ${guild.memberCount} users, ${guild.roles.cache.size} roles, ${guild.channels.cache.size} channels`)
    str += `\n${guild.name}(${guild.id}), ${guild.memberCount} users, ${guild.roles.cache.size} roles, ${guild.channels.cache.size} channels`
    db.set(guild.name, guild.id);
  });
  log.send(`**${client.user.tag} was now online!** \n<t:${Math.floor(Date.now() / 1000)}>\n\n${str}\`\`\``);

  // Set bot status
  client.user.setPresence({ activities: [{ name: "誰在做夢", type: 3 }], status: 'idle', clientStatus: "PS5" });

  // Start scheduled message
  let scheduledMessage = new cron.CronJob('00 00 12 * * *', () => {
    const guild = client.guilds.cache.get(secret.grp2);
    const channel = guild.channels.cache.get(secret.channelID2);
    channel.send('你各位別當死魚堆');
  });
  scheduledMessage.start()

  // Self-role
  const sr_log = await client.channels.fetch(secret.self_role_log_channel);
  // Get your guild (server) and the specific channel
  const guild = client.guilds.cache.get('949153367609987124');
  const channel = guild.channels.cache.get('963802334482284595');

  // Fetch the specific message by ID
  const message = await channel.messages.fetch('963802394045583370');

  // React to the message with your emoji
  message.react('<:makaneko_surprise:958407417559908382>');

  // Create a reaction collector
  const filter = (reaction, user) => {
    // Check if the emoji name is the one you specified and ignore the bot's reactions
    return reaction.emoji.name === 'makaneko_surprise' && !user.bot;
  };

  // Check for reaction changes
  const collector = message.createReactionCollector({ filter });

  collector.on('collect', async (reaction, user) => {
    const link = `https://discord.com/channels/${reaction.message.guildId}/${reaction.message.channelId}/${reaction.message.id}`;
    const role = guild.roles.cache.get('964140235401355304');
    const member = guild.members.cache.get(user.id);

    // Remove roles if they already have it
    if (member.roles.cache.has(role.id)) {
      await member.roles.remove(role);
      reaction.users.remove(user.id);
      sr_log.send(`**Self-role**\n\n${link}\nRemoved role \`\`${role.name}\`\` from \`\`${user.tag}\`\``);
    } else {
    // Add roles if they didn't have it
      await member.roles.add(role);
      reaction.users.remove(user.id);
      sr_log.send(`**Self-role**\n\n${link}\nAdded role \`\`${role.name}\`\` to \`\`${user.tag}\`\``);
    }
  });
});