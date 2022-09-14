const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');


const Discord = require('discord.js');
const translate = require('@vitalets/google-translate-api');
const { MessageAttachment } = require('discord.js');
// const {
//   Client, GatewayIntentBits, Embed, Embedbuilder, EnumResolvers, GatewayIntendBits, Partials, ApplicationCommandType, ApplicationCommandOptionType, ButtonStyle, Colors, Collection, MessageEmbed, ButtonBuilder
// } = require('discord.js');
// const client = new Client({
//   partials: ['Messages', 'Channels', 'Reactions', 'GuildMembers', 'enum'], intents: ["Guilds","GuildMembers","GuildBans","GuildIntegrations","GuildWebhooks","GuildInvites","GuildVoiceStates","GuildPresences","GuildMessages","GuildMessageReactions","GuildMessageTyping","DirectMessages","DirectMessageReactions","DirectMessageTyping"],
// });


const {
  Client, Intents, Embed, Embedbuilder, EnumResolvers, GatewayIntendBits, Partials, ApplicationCommandType, ApplicationCommandOptionType, ButtonStyle, Colors, Collection, MessageEmbed, ButtonBuilder
} = require('discord.js');
const fs = require('fs')
const client = new Discord.Client({
messageCacheLifetime: 60,
fetchAllMembers: false,
messageCacheMaxSize: 10,
restTimeOffset: 0,
restWsBridgetimeout: 100,
shards: "auto",
allowedMentions: {
  parse: ["roles", "users", "everyone"],
  repliedUser: true,
},
partials: [
Partials.Message,
  Partials.Channel,
  Partials.GuildMember,
  Partials.Reaction,
  Partials.GuildScheduledEvent,
  Partials.User,
  Partials.ThreadMember,
  Partials.enum
],
intents: ['Guilds',
  'GuildMembers',
  'GuildBans',
  'GuildEmojisAndStickers',
  'GuildIntegrations',
  'GuildWebhooks',
  'GuildInvites',
  'GuildVoiceStates',
  'GuildPresences',
  'GuildMessages',
  'GuildMessageReactions',
  'GuildMessageTyping',
  'DirectMessages',
  'DirectMessageReactions',
  'DirectMessageTyping',
  'MessageContent']
});

const keep_alive = require('./keep_alive.js')
const secret = require('./config.json')


process.setMaxListeners(50)
process.on('unhandledRejection', err => {

  var channel = client.channels.fetch('994459707580358656').then(channel => {
    channel.send(`Unhandled Promise Rejection: ${err}`);
  })
  });

client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./Commands");
client.events = new Collection();

client.slashCommands = new Collection();

module.exports = client;

["command", "event", 'slash'].forEach(handler => {
  require(`./structures/${handler}`)(client);
});


// //twitter track start
// client.once('ready', () => {
//   const cmd = 'main';
//   let command = client.commands.get(cmd)
//   if(!command) command = client.commands.get(client.aliases.get(cmd));
//   if(command) command.run(client, secret)
// });




//new member
client.on('guildMemberAdd', async member => {
  const cmd = 'join';
  let command = client.commands.get(cmd)
  if(!command) command = client.commands.get(client.aliases.get(cmd));
  if(command) command.run(client, message, secret, member)
});


//role change

client.on('guildMemberUpdate', async (oldMember, newMember) => { 
  const cmd = 'mupdate';
  let command = client.commands.get(cmd)
  if(!command) command = client.commands.get(client.aliases.get(cmd));
  if(command) command.run(client, oldMember, newMember)
});


//message edit
client.on('messageUpdate', async (oldMessage, newMessage) => { 
  if (newMessage.channel.parent.id === "974997417315414016") return;  
  if(!newMessage.guild) return;
  const cmd = 'msgupdate';
  let command = client.commands.get(cmd)
  if(!command) command = client.commands.get(client.aliases.get(cmd));
  if(command) command.run(client, oldMessage, newMessage, secret)
});


//message delete log
client.on('messageDelete', async (message) => {
  if (message.channel.parent.id === "974997417315414016") return;  
  if(!message.guild) return;
  const cmd = 'delete-logger';
  let command = client.commands.get(cmd)
  if(!command) command = client.commands.get(client.aliases.get(cmd));
  if(command) command.run(client, message, secret)
})


//dm edit detect
client.on('messageUpdate', async (oldMessage, newMessage) => {
  if (newMessage.channel.type == 1) {
  const cmd = 'pm-edit-logger';
  let command = client.commands.get(cmd)
  if(!command) command = client.commands.get(client.aliases.get(cmd));
  if(command) command.run(client, oldMessage, newMessage, secret)
}
});


//dm delete detect
client.on('messageDelete', async (message) => {
  if (message.channel.type == 1) {
  const cmd = 'pm-delete-logger';
  let command = client.commands.get(cmd)
  if(!command) command = client.commands.get(client.aliases.get(cmd));
  if(command) command.run(client, message, secret)
}
});


client.on('ready', async() => {
  const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/group.sqlite" }); 
  console.log(`Logged in as ${client.user.tag}!`);
  client.guilds.cache.forEach(guild => (async() => {await db.set(guild.name, guild.id)})()); //console.log(`${guild.name}(${guild.id})`)
  var g = await db.all();
  console.log(g)
  // let scheduledMessage = new cron.CronJob('00 00 04 * * *', () => {
  //   const guild = client.guilds.cache.get(secret.grp2);
  //   const channel = guild.channels.cache.get(secret.channelID2);
  //   channel.send('你各位別當死魚堆');
  // });
  // scheduledMessage.start()
});
let date_ob = new Date();

// current date
// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

// current hours
let hours = date_ob.getHours();

// current minutes
let minutes = date_ob.getMinutes();

// current seconds
let seconds = date_ob.getSeconds();

// prints date in YYYY-MM-DD format
console.log(year + "-" + month + "-" + date);

// prints date & time in YYYY-MM-DD HH:MM:SS format
console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

// prints time in HH:MM format
console.log(hours + ":" + minutes);

const cron = require('cron');


client.setMaxListeners(50)

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}














client.on('messageCreate', (message) => {
  try {
    // if (message.author.id === secret.me) return;
    if (message.channel.id === secret.log_channel) return;
    // if (message.channel.parent.id === "946997221969240075") return; 
    // if (message.channel.parent.id === "963763737683181568") return;
    // if (message.channel.parent.id === "974997417315414016") return;  
    // if (message.channel.parent.id === "951150838657744937") return; 
    // if (message.channel.parent.id === "948101203202543696") return; 
    // if (message.channel.parent.id === "949597072343068714") return;
    // if (message.channel.parent.id === "942625037956030504") return;
    // if (message.channel.parent.id === "969408256768344066") return;
    if (message.content.toLowerCase().includes('老ㄆㄛˊ') || message.content.toLowerCase().includes('waifu')) {
      message.reply('醒')
    }

    if (message.content.toLowerCase().includes('wife')) {
      message.reply('wake up damn');
    }

    if (message.content.toLowerCase().includes('愛你')) {
      if (message.member.roles.cache.some(role => role.name == "元首")) return;
      if (message.author.bot) { return; }
      message.reply('我不愛你');
    }

    if (message.content.toLowerCase().includes('ちゃんは大好きだよ') || message.content.toLowerCase().includes('ちゃんとけっこんしました') || message.content.toLowerCase().includes('妻になって') || message.content.toLowerCase().includes('はの夫') || message.content.toLowerCase().includes('一緒に寝る') || message.content.toLowerCase().includes('俺の嫁')) {
      message.channel.send('消え失せろ');
    }

    if (message.content.toLowerCase().includes('床上玩') || message.content.toLowerCase().includes('るーちゃん') && message.content.toLowerCase().includes('我') || message.content.toLowerCase().includes('るーちゃん') && message.content.toLowerCase().includes('聖水') || message.content.toLowerCase().includes('るーちゃん') && message.content.toLowerCase().includes('在') || message.content.toLowerCase().includes('るーちゃん') && message.content.toLowerCase().includes('說') || message.content.toLowerCase().includes('るーちゃん') && message.content.toLowerCase().includes('跟') || message.content.toLowerCase().includes('るーちゃん') && message.content.toLowerCase().includes('會') || message.content.toLowerCase().includes('るーちゃん') && message.content.toLowerCase().includes('睡') || message.content.toLowerCase().includes('るーちゃん') && message.content.toLowerCase().includes('來') || message.content.toLowerCase().includes('るーちゃん') && message.content.toLowerCase().includes('和')) {
      message.channel.send('消え失せろ');
    }

    if (message.content.toLowerCase().includes('床上玩') || message.content.toLowerCase().includes('みけねこちゃん') && message.content.toLowerCase().includes('我') || message.content.toLowerCase().includes('みけねこちゃん') && message.content.toLowerCase().includes('聖水') || message.content.toLowerCase().includes('みけねこちゃん') && message.content.toLowerCase().includes('在') || message.content.toLowerCase().includes('みけねこちゃん') && message.content.toLowerCase().includes('說') || message.content.toLowerCase().includes('みけねこちゃん') && message.content.toLowerCase().includes('跟') || message.content.toLowerCase().includes('みけねこちゃん') && message.content.toLowerCase().includes('會') || message.content.toLowerCase().includes('みけねこちゃん') && message.content.toLowerCase().includes('睡') || message.content.toLowerCase().includes('みけねこちゃん') && message.content.toLowerCase().includes('來') || message.content.toLowerCase().includes('みけねこちゃん') && message.content.toLowerCase().includes('和')) {
      message.channel.send('消え失せろ');
    }

    if (message.content.toLowerCase().includes('結婚') || message.content.toLowerCase().includes('窩璦妮')) {
      if ((message.guild.id === secret.grp1) && (message.member.roles.cache.some(role => role.name == "元首"))) return;
      message.channel.send('滾開點');
    }

    if (message.content.toLowerCase().includes('平板')) {
      message.reply('https://cdn.discordapp.com/attachments/946997403578404864/957699560967376966/FB_IMG_1643680126724.jpg');
    }

    if (message.content.toLowerCase().includes('pettan')) {
      message.reply('https://cdn.discordapp.com/attachments/946997403578404864/957914419852111922/FB_IMG_1643680110105.jpg');
    }

    if (message.content.toLowerCase().includes('床上玩') || message.content.toLowerCase().includes('露') && message.content.toLowerCase().includes('我') || message.content.toLowerCase().includes('露') && message.content.toLowerCase().includes('聖水') || message.content.toLowerCase().includes('露') && message.content.toLowerCase().includes('在') || message.content.toLowerCase().includes('露') && message.content.toLowerCase().includes('說') || message.content.toLowerCase().includes('露') && message.content.toLowerCase().includes('跟') || message.content.toLowerCase().includes('露') && message.content.toLowerCase().includes('會') || message.content.toLowerCase().includes('編故事') || message.content.toLowerCase().includes('露') && message.content.toLowerCase().includes('睡') || message.content.toLowerCase().includes('露') && message.content.toLowerCase().includes('來')) {
      if (message.guild.id === '942625037498867722') message.channel.send('<#963807692839862352>, 謝謝')
      else { message.channel.send('<#950398610284097597>, 謝謝') };
    }

    if (message.content.toLowerCase().includes('找其他人') || message.content.toLowerCase().includes('外遇')) {
      message.reply('你再說一次？<:RushiaYandere:948941963170828328>');
    }

    if (message.content.toLowerCase().includes('女') && message.content.toLowerCase().includes('友') || message.content.toLowerCase().includes('彼') && message.content.toLowerCase().includes('女')) {
      message.channel.send('醒');
    }

    if (message.content.toLowerCase().includes('胸')) {
      message.reply('https://cdn.discordapp.com/attachments/946997403578404864/957911151394586624/FB_IMG_1638487832614.jpg');
    }

    if ((message.content.toLowerCase().includes('砧板')) || (message.content.toLowerCase().includes('まな板'))) {
      message.reply('https://cdn.discordapp.com/attachments/946997403578404864/957914420502212698/FB_IMG_1643680054229.jpg');
    }

    if (message.content.toLowerCase().includes('婆')) {
      var a = (`https://media.discordapp.net/attachments/956867669959794728/960943560117596221/FB_IMG_1628385959138.jpg`);
      var b = (`醒`);
      let n = getRandomNumber(0, 2);
      if (n == 1) {
        message.reply(a);
      }
      else { message.reply(b); }
    }

    if (message.content.toLowerCase().includes('清潔')) {
      message.reply('https://media.discordapp.net/attachments/956867669959794728/961972142487007232/Screenshot_20220320-210121_Markup.png').then(msg => {
        setTimeout(() => msg.delete(), 1000);
      })
    }

    if (message.content.toLowerCase().includes('boing')) {
      if (message.content.toLowerCase().includes('not')) return message.reply('你再說一次？<:RushiaYandere:948941963170828328>');
      message.reply('https://media.discordapp.net/attachments/956867669959794728/963813505750954054/FB_IMG_1648803227500.jpg');
      message.react('<a:3994rushiahappy:948938443218649090>');
    }
  } catch (e) { console.log(e) }
});


process.on('unhandledRejection', err => {
  console.log(`[ERROR] Unhandled promise rejection: ${err.message}.`);
  console.log(err);
});






//self role
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


client.login(secret.token).then(() => {
  client.user.setPresence({ activities: [{ name: '久違的維護中', type: 'Playing' }], status: 'idle' }); //誰在做夢， WATCHING
});
