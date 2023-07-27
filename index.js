// Imports the client library
const { Routes } = require('discord-api-types/v10');
const fs = require('fs')
const keep_alive = require('./keep_alive.js');
const secret = require('./config.json');
// Creates clients
const {
  Client, ComponentType, REST, Intents, Embed, Embedbuilder, EnumResolvers, GatewayIntendBits, Partials, ApplicationCommandType, ApplicationCommandOptionType, ButtonStyle, Colors, Collection, MessageEmbed, MessageAttachment, ButtonBuilder, WebhookClient
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

client.setMaxListeners(50);
process.setMaxListeners(50);

for (const collection of ["info", "cmd", "twitter", "music", "aliases", "categories", "events", "slashCommands"]) {
  client[collection] = new Collection();
}

client.categories = fs.readdirSync("./Commands");

// Export
module.exports = client;


["command", "mjs", "event", 'slash'].forEach(handler => {
  require(`./structures/${handler}`)(client);
});

// Emoji
client.emotes = {
  "play": "▶️",
  "stop": "⏹️",
  "queue": "📄",
  "success": "☑️",
  "repeat": "🔁",
  "error": "❌"
}

// Show time
let date_ob = new Date();
let full_date = date_ob.toISOString().split('T')[0];
let date_time = date_ob.toISOString().replace('T', ' ').split('.')[0];
let time = date_ob.toTimeString().split(' ')[0];
console.log(`${full_date}\n${date_time}\n${time}`);

// if there are errors, log them
client.on("disconnect", () => console.log("Bot is disconnecting...", "warn"))
  .on("reconnecting", () => console.log("Bot reconnecting...", "log"))
  .on("error", (e) => console.log(date_time, e, "error"))
  .on("warn", (info) => console.log(date_time, info, "warn"));

// if there is an unhandledRejection, log them
process.on('unhandledRejection', err => {
  console.log(`[ERROR] Unhandled promise rejection: ${err.message}.`);
  console.log(err);

  client.channels.fetch('994459707580358656').then(channel => {
    channel.send(`Unhandled Promise Rejection: ${err}`);
  })
});

// Login
client.login(secret.token);
