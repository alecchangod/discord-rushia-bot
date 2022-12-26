// Imports the client library
const { Routes } = require('discord-api-types/v10');
const fs = require('fs')
const { MessageAttachment } = require('discord.js');
const keep_alive = require('./keep_alive.js')
const secret = require('./config.json')
// Creates clients
const {
  Client, ComponentType, REST, Intents, Embed, Embedbuilder, EnumResolvers, GatewayIntendBits, Partials, ApplicationCommandType, ApplicationCommandOptionType, ButtonStyle, Colors, Collection, MessageEmbed, ButtonBuilder
} = require('discord.js');
const client = new Client({
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

process.setMaxListeners(50)

client.info = new Collection();
client.cmd = new Collection();
client.twitter = new Collection();
client.music = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./Commands");
client.events = new Collection();
client.slashCommands = new Collection();

module.exports = client;

["command", "event", 'slash'].forEach(handler => {
  require(`./structures/${handler}`)(client);
});

// emoji
client.emotes = {
    "play": "▶️",
    "stop": "⏹️",
    "queue": "📄",
    "success": "☑️",
    "repeat": "🔁",
    "error": "❌"
}

// current date
let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2); // adjust 0 before single digit date
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2); // current month
let year = date_ob.getFullYear(); // current year
let hours = date_ob.getHours(); // current hours
let minutes = date_ob.getMinutes(); // current minutes
let seconds = date_ob.getSeconds(); // current seconds
console.log(year + "-" + month + "-" + date); // prints date in YYYY-MM-DD format
console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds); // prints date & time in YYYY-MM-DD HH:MM:SS format
console.log(hours + ":" + minutes); // prints time in HH:MM format

client.setMaxListeners(50)

// if there are errors, log them
client.on("disconnect", () => console.log("Bot is disconnecting...", "warn"))
  .on("reconnecting", () => console.log("Bot reconnecting...", "log"))
  .on("error", (e) => console.log(e, "error"))
  .on("warn", (info) => console.log(info, "warn"));

// if there is an unhandledRejection, log them
process.on('unhandledRejection', err => {
  console.log(`[ERROR] Unhandled promise rejection: ${err.message}.`);
  console.log(err);

  client.channels.fetch('994459707580358656').then(channel => {
    channel.send(`Unhandled Promise Rejection: ${err}`);
  })
});

//login
client.login(secret.token)
