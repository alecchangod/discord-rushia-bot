// Imports the client library
const client = require('../../index.js')
const secret = require('../../config.json')
const cron = require('cron');
// start-up activities
client.on('ready', async () => {

  console.log(`${client.user.tag} is ready on ${client.guilds.cache.size} servers.`);
  client.guilds.cache.forEach(guild => console.log(`${guild.name}(${guild.id}), ${guild.memberCount} user, ${guild.roles.cache.size} roles, ${guild.channels.cache.size} channels`))
  // console.log(client.guilds.cache)
  // msgCount = await client.guilds.cache.message.size;
  // console.log(`${msgCount}`);

  const { QuickDB } = require("quick.db");
  const db = new QuickDB({ filePath: "database/group.sqlite" });
  console.log(`Logged in as ${client.user.tag}!`);
  client.guilds.cache.forEach(guild => (async () => { await db.set(guild.name, guild.id) })());
  client.user.setPresence({ activities: [{ name: "誰在做夢", type: 3 }], status: 'idle', clientStatus: "PS5" });
  //send scheduled message
  let scheduledMessage = new cron.CronJob('00 00 12 * * *', () => {
    const guild = client.guilds.cache.get(secret.grp2);
    const channel = guild.channels.cache.get(secret.channelID2);
    channel.send('你各位別當死魚堆');
  });
  scheduledMessage.start()
});


// self role
client.once('ready', () => {
  let channel = client.channels.fetch('963802334482284595').then(channel => {
    try {
      channel.messages.fetch('963802394045583370').then(message => {
        message.react('<:makaneko_surprise:958407417559908382>')
        const filter = (reaction, user) => {
          return reaction.emoji.name === 'makaneko_surprise';
        };


        const collector = message.createReactionCollector({ filter });


        collector.on('collect', (reaction, user) => {
          const role = message.guild.roles.fetch('964140235401355304');

          message.guild.members.fetch(user.id).then(member => {
            member.roles.add('964140235401355304');
          });
        });
      })
    } catch (e) { console.log(e) }
  })
});


// // twitter track start
// client.once('ready', () => {
//   const cmd = 'twitter-main';
//   let command = client.twitter.get(cmd)
//   if (!command) command = client.twitter.get(client.aliases.get(cmd));
//   if (command) command.run(client, secret)
// });