// Imports the client library
const client = require('../../index.js')
const PREFIX = '='
const secret = require('../../config.json')
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/prefix.sqlite" });
const { DisTube } = require('distube')
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')
client.distube = new DisTube(client, {
  leaveOnStop: false,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin({
      emitEventsAfterFetching: true
    }),
    new SoundCloudPlugin(),
    new YtDlpPlugin()
  ]
})
//function
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

//command
client.on('messageCreate', async message => {
  // console.log(message)
  if (message.author.bot) return;
  if (!message.guild) return;
  var prefix = await db.get(`prefix_${message.guild.id}`)
  if (prefix == null) {
    var prefix = PREFIX;
  } else {
    prefix = prefix
  }
  if (!message.content.startsWith(prefix)) return;
  if (!message.member) message.member = await message.guild.members.fetch(message);
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (cmd.length == 0) return;
  let command = client.info.get(cmd) || client.cmd.get(cmd) || client.twitter.get(cmd) || client.music.get(cmd)
  if (!command) command = client.info.get(client.aliases.get(cmd)) || client.cmd.get(client.aliases.get(cmd)) || client.twitter.get(client.aliases.get(cmd)) || client.music.get(client.aliases.get(cmd));
  if (command.inVoiceChannel === true && message.member.voice.channel === null) {
    return message.channel.send(`${client.emotes.error} | You must be in a voice channel!`)
  };
  if (command) try { command.run(client, message, args, secret, prefix) } catch (e) {
    console.error(e)
    message.channel.send(`${client.emotes.error} | Error: \`${e}\``)
  }
});


//message log
client.on('messageCreate', async message => {
  if (!message.guild) return;
  const cmd = 'send-logger';
  let command = client.info.get(cmd)
  if (!command) command = client.info.get(client.aliases.get(cmd));
  if (command) command.run(client, message, secret)
});


//dm detect
client.on('messageCreate', async (message) => {
  if (message.channel.type == 1) {
    const cmd = 'pm-logger';
    let command = client.info.get(cmd)
    if (!command) command = client.info.get(client.aliases.get(cmd));
    if (command) command.run(client, message, secret)
  }
});


//self protect
client.on('messageCreate', async message => {
  try {
    if (message.author.id === secret.botid) return;
    if (message.reference.messageId) {
      if ((message.content.toLowerCase().includes('滾')) || (message.content.toLowerCase().includes('閉嘴')) || (message.content.toLowerCase().includes('草')) || (message.content.toLowerCase().includes('幹')) || (message.content.toLowerCase().includes('操')) || (message.content.toLowerCase().includes('安靜')) || (message.content.toLowerCase().includes('賣插')) || (message.content.toLowerCase().includes('賣吵')) || (message.content.toLowerCase().includes('麥插')) || (message.content.toLowerCase().includes('麥吵'))) {
        const repliedTo = await message.channel.messages.fetch(message.reference.messageId);
        if (repliedTo.author.id === secret.botid) {
          message.reply('蛤')
        };

      }
      if ((message.content.toLowerCase().includes('早安'))) {
        const repliedTo = await message.channel.messages.fetch(message.reference.messageId);
        if (repliedTo.author.id === secret.botid) {
          message.reply('早安')
        };

      }
      if ((message.content.toLowerCase().includes('怎麽了'))) {
        const repliedTo = await message.channel.messages.fetch(message.reference.messageId);
        if (repliedTo.author.id === secret.botid) {
          message.reply('不知道')
        };

      }
      if ((message.content.toLowerCase().includes('蛤三小'))) {
        const repliedTo = await message.channel.messages.fetch(message.reference.messageId);
        if (repliedTo.author.id === secret.botid) {
          message.reply('早安 <:RushiaYandere:948941963170828328>')
        };

      }
      else if ((message.content.toLowerCase().includes('蛤'))) {
        const repliedTo = await message.channel.messages.fetch(message.reference.messageId);
        if (repliedTo.author.id === secret.botid) {
          message.reply('早安')
        };

      }
    }
  } catch (e) { }
});

//don't sleep
client.on('messageCreate', (message) => {
  try {
    if (message.author.id === secret.botid) return;
    // if (message.author.id === secret.me) return;
    if (message.channel.id === secret.log_channel) return;
    if (message.channel.parent?.id === "946997221969240075") return;
    if (message.channel.parent?.id === "963763737683181568") return;
    if (message.channel.parent?.id === "974997417315414016") return;
    if (message.channel.parent?.id === "951150838657744937") return;
    if (message.channel.parent?.id === "948101203202543696") return;
    if (message.channel.parent?.id === "949597072343068714") return;
    if (message.channel.parent?.id === "942625037956030504") return;
    // if (message.channel.parent?.id === "969408256768344066") return; //bot testing channel
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
      var msg = message.content.split("婆");
      if (msg[2] != undefined) return message.reply("https://cdn.discordapp.com/attachments/956867669959794728/1037586158877679636/unknown.png");
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


// music

const status = queue =>
  `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.names.join(', ') || 'Off'}\` | Loop: \`${queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
  }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
client.distube
  .on('playSong', (queue, song) =>
    queue.textChannel.send(
      `${client.emotes.play} | Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user
      }\n${status(queue)}`
    )
  )
  .on('addSong', (queue, song) =>
    queue.textChannel.send(
      `${client.emotes.success} | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
    )
  )
  .on('addList', (queue, playlist) =>
    queue.textChannel.send(
      `${client.emotes.success} | Added \`${playlist.name}\` playlist (${playlist.songs.length
      } songs) to queue\n${status(queue)}`
    )
  )
  .on('error', (channel, e) => {
    if (channel) channel.send(`${client.emotes.error} | An error encountered: ${e.toString().slice(0, 1974)}`)
    else console.error(e)
  })
  .on('empty', channel => channel.send('Voice channel is empty! Leaving the channel...'))
  .on('searchNoResult', (message, query) =>
    message.channel.send(`${client.emotes.error} | No result found for \`${query}\`!`)
  )
  .on('finish', queue => queue.textChannel.send('Finished!'))
.on("searchResult", (message, result) => {
    let i = 0
    message.channel.send(
        `**Choose an option from below**\n${result
            .map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``)
            .join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`
    )
})
.on("searchCancel", message => message.channel.send(`${client.emotes.error} | Searching canceled`))
.on("searchInvalidAnswer", message =>
    message.channel.send(
        `${client.emotes.error} | Invalid answer! You have to enter the number in the range of the results`
    )
)
.on("searchDone", () => {})

