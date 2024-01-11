// Imports the client library
const client = require("../../index.js");
const fs = require("fs");
const PREFIX = "=";
const secret = require("../../config.json");
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });
const bl = new QuickDB({ filePath: "database/bad_word.sqlite" });
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");
client.distube = new DisTube(client, {
  leaveOnStop: false,
  leaveOnEmpty: false,
  nsfw: true,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin({
      emitEventsAfterFetching: true,
    }),
    new SoundCloudPlugin(),
    new YtDlpPlugin(),
  ],
});
//function
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

//blocked word
client.on("messageCreate", async (message) => {
  // Ignore messages from the bot itself
  if (message.author.id === secret.botid) return;

  // Get the prefix from the database or use the default
  var prefix = (await db.get(`prefix_${message.guild?.id}`)) || PREFIX;

  // Ignore commands for adding or deleting blocked words
  if (
    message.content.startsWith(`${prefix}bl ban`) ||
    message.content.startsWith(`${prefix}bl unban`)
  )
    return;

  // Check if the guild has blocked words
  var grp = await bl.get("group");
  if (!JSON.stringify(grp).includes(message.guild?.id)) return;

  // Get the list of blocked words for this guild
  var blocked = await bl.get(`${message.guild.id}_word`);

  // Delete the message if it contains a blocked word
  blocked.forEach((word) => {
    if (message.content.includes(word)) {
      message.delete();
    }
  });
});

//command
client.on("messageCreate", async (message) => {
  // Ignore bot messages and DMs messages
  if (message.author.bot || !message.guild) return;

  // Ignore message sent in disabled channel
  const disabled = await db.get("no_commands");
  if (JSON.stringify(disabled)?.includes(message.channel.id)) return;

  // Get the prefix from the database or use the default
  var prefix = (await db.get(`prefix_${message.guild.id}`)) || PREFIX;
  if (!message.content.startsWith(prefix)) return;

  // Fetch message author
  if (!message.member)
    message.member = await message.guild.members.fetch(message);

  // Split message for future use
  const args = message.content.slice(prefix.length).trim().split(/ +/g);

  // Check for command inputed
  const cmd = args.shift().toLowerCase();
  if (cmd.length == 0) return;

  // Log command useage
  client.channels.fetch(secret.cmd_log_channel).then(async (channel) => {
    channel.send(
      `Guild: ${message.guild?.name} \n Channel parent: ${
        message.channel.parent.name
      } \n Channel: ${message.channel.name} \n User: <@${message.author.id}> ${
        message.author.discriminator === "0" ? "@" : ""
      }${message.author.username}${
        message.author.discriminator === "0"
          ? ""
          : `#${message.author.discriminator}`
      } \n Message: ${message.content}`
    );
  });

  // Get command
  let command =
    client.info.get(cmd) ||
    client.cmd.get(cmd) ||
    client.music.get(cmd) ||
    client.cmd.get(client.aliases.get(cmd)) ||
    client.music.get(client.aliases.get(cmd));

  // Return if command not found
  if (!command) return;

  // Check if it was a music command
  if (command.inVoiceChannel && !message.member.voice.channel) {
    return message.channel.send(
      `${client.emotes.error} | You must be in a voice channel!`
    );
  }

  // Get language code from database or use server's one
  var langc =
    (await db.get(`lang_${message.guild.id}`)) || message.guild.preferredLocale;

  let trans_name = command.trans ? command.trans : cmd;

  let file_exist = fs.existsSync(`trans/${langc}/${trans_name}.json`);

  let trans = file_exist
    ? require(`../../trans/${langc}/${trans_name}.json`)
    : require(`../../trans/en-US/${trans_name}.json`);

  // Run the command and catch error
  if (command) {
    try {
      command.run(client, message, args, secret, prefix, trans, langc);
    } catch (e) {
      console.error(e);
      message.channel.send(`${client.emotes.error} | Error: \`${e}\``);
    }
  }
});

// Common function to fetch command and execute it
async function fetchAndRunCommand(message, cmd) {
  let command =
    client.info.get(cmd) || client.info.get(client.aliases.get(cmd));
  var langc = secret.bot_lang;

  let trans_name = cmd;

  let file_exist = fs.existsSync(`trans/${langc}/${trans_name}.json`);

  let trans = file_exist
    ? require(`../../trans/${langc}/${trans_name}.json`)
    : require(`../../trans/en-US/${trans_name}.json`);

  if (command) command.run(client, message, secret, trans, langc);
}

// Loggers
client.on("messageCreate", async (message) => {
  if (message.channel.type == 1) {
    fetchAndRunCommand(message, "dms-logger");
  } else if (message.guild) {
    fetchAndRunCommand(message, "message-logger");
  }
});

// Self-protect
client.on("messageCreate", processMessage);

async function processMessage(message) {
  // Ignore bot message and non-reply messages
  if (message.author.id === secret.botid || !message.reference) return;
  const repliedTo = await fetchRepliedMessage(message);
  // Check who is they replying and return if message doesn't exist
  if (!repliedTo || repliedTo.author.id !== secret.botid) return;
  const response = checkResponses(message.content.toLowerCase());
  if (response) return message.reply(response);
}

async function fetchRepliedMessage(message) {
  try {
    return await message.channel.messages.fetch(message.reference.messageId);
  } catch (error) {
    return null;
  }
}

function checkResponses(content) {
  const responses = {
    滾: "~~你嗎? 要滾去哪裏~~",
    哈: "怎麽",
    笑死: "~~要死了嗎? 一路好走~~ <:ShaSha_RIP:1133085967985672232>",
    就幹你: "<:nekocatgun:962380133354844181>",
    幹你啊: "<:nekocatgun:962380133354844181>",
    幹你: "<:FBI_Billy:959420058453557350> 這裏有位FBI欸 啊你剛説什麽?",
    fuck: "<:nekocatgun:962380133354844181> 要來打架是不是",
    來啊: "<a:pingpong:959396721333522432><a:pingpong:959396721333522432><a:pingpong:959396721333522432>",
    nekocatgun: "<:nekocatgun:962380133354844181> 要來打架是不是",
    pingpong:
      "<a:pingpong:959396721333522432><a:pingpong:959396721333522432><a:pingpong:959396721333522432>",
    煩: "<a:pingpong:959396721333522432>",
    幹: "~~你要幹誰?~~",
    安靜: "蛤",
    賣插: "蛤",
    賣吵: "蛤",
    麥插: "蛤",
    麥吵: "蛤",
    閉嘴: "蛤",
    説不出: "爲什麽我要浪費時間在你身上?",
    沒話説: "爲什麽我要浪費時間在你身上?",
    我是: "蛤? 你誰啊? 我不認識欸",
    因爲: "蛤? 你誰啊?",
    蛤三小: "怎麽? 有意見? 活膩了是不是?",
    不行: "我有説可以嗎?",
    早安: "早安",
    蛤: "蛤三小",
    怎麽了: "不知道",
    操: "怎麽? 有意見?",
    草: "好吃嗎? <a:eat:959739205670539294>",
    供三小: "蛤",
    嗨: "嗨",
    怎麽: "有意見?",
    三小: "尛",
    你誰: "~~我怎麽知道~~",
    誰: "你要找誰?",
    操: "去操自己 <:emoji_34:961594390994882570>",
    不要: "我有問你意見?",
    你忘記:
      "https://media.discordapp.net/attachments/956867669959794728/960943560117596221/FB_IMG_1628385959138.jpg",
    婆: "婆婆?",
    要你説: "我有問你意見嗎?",
    還要你同意: "我有問你意見嗎?",
    你同意: "什麽鬼",
    不能說嗎: "誰説你可以的?",
    啊: "怎麽?",
    "love you": "💞💕💞",
    "?": "蛤",
    ".": "?",
    "": "怎麽",
  };
  for (const key in responses) {
    if (content.includes(key)) {
      return responses[key];
    }
  }
  return null;
}

// Webhook
client.on("messageCreate", async (message) => {
  // Check if user has enabled webhook in the channel
  var ch = await db.get(`webhook_${message.channel.id}`);
  if (!ch || !JSON.stringify(ch).includes(message.author.id)) return;

  if (message.content == 0)
    try {
      message = await message.channel.messages.fetch(message.id);
    } catch (error) {
      return null;
    }

  if (message.reference?.messageId) return;
  let emoji = true;
  if (
    (message.content.includes("<:") || message.content.includes("<a:")) &&
    message.content.includes(">")
  ) {
    const emoji_id = message.content.includes("<a:")
      ? message.content.split("<a:")[1].split(":")[1].split(">")[0]
      : message.content.split("<:")[1].split(":")[1].split(">")[0];
    emoji = client.emojis.cache.get(emoji_id);
  }
  if (message.stickers.size >= 1) return;

  // Find webhook that the bot can use
  const webhookClient = await message.channel.fetchWebhooks();
  var webhook = webhookClient.find((wh) => wh.token);

  if (!webhook) {
    console.log("No webhook was found that I can use!");
    console.log("Now I'll create a new one.");
    var webhook = await message.channel.createWebhook({
      name: "Rushia",
    });
  }

  // Check if the bot has access to the emoji
  if (!emoji) return console.log("I don't have access to that emoji :(");

  // Send with nickname if set
  const user = await message.guild.members.fetch(message.author.id);
  let uname = user.nickname ? user.nickname : message.author.username;

  // Set message details
  let msg = {
    content: message.content.toString(),
    username: uname,
    avatarURL: user.displayAvatarURL(),
  };

  // Add attatchments when found and doesn't exist the file size limit
  if (message.attachments.size >= 1) {
    let size = 0;
    message.attachments.forEach((attachments) => {
      size += attachments.size;
    });
    if (size > 26214400) return;
    msg.files = Array.from(message.attachments.values());
  }
  // Resend user message as a webhook
  try {
    await webhook.send(msg).then(async () => await message.delete());
  } catch (error) {
    console.log(error);
    console.log(message);
    console.log(message.content);
    console.log(message.content.length);
  }
});

//don't sleep
client.on("messageCreate", async (message) => {
  try {
    if (message.author.id === secret.botid) return;
    if (
      message.author.id === secret.me &&
      message.guild?.id != "949153367609987124"
    )
      return; // Only blacklist my message at testing group
    if (message.channel.parent?.id === "946997221969240075") return; // Rushia chin server board
    if (message.channel.parent?.id === "963763737683181568") return; // Bot log channel
    if (message.channel.parent?.id === "974997417315414016") return; // Kiyu bro channel
    if (message.channel.parent?.id === "951150838657744937") return; // Rushia chin server admin parent
    if (message.channel.parent?.id === "948101203202543696") return; // Rushia chin server as you wish
    if (
      message.channel.parent?.id === "949597072343068714" ||
      message.channel.parent?.id === "998293310244388864"
    )
      return; // Rushia chin server notify (mikeneko)
    if (message.channel.parent?.id === "942625037956030504") return; // Rushia chin small server (2) board
    if (message.guild.id === "1079103834015662130") return; // Chat group

    // Ignore bot message
    if (message.author.bot) {
      return;
    }

    // Fetch message author
    if (!message.member)
      message.member = await message.guild.members.fetch(message);

    // Don't reply for my big bro
    const roleCheck = message.member.roles.cache.some(
      (role) => role.name == "元首"
    );
    if (roleCheck) return;

    // Check messages
    const includesAny = (str, substrings) =>
      substrings.some((substring) => str.includes(substring));

    // Reply
    const subStrings = ["我", "聖水", "在", "說", "跟", "會", "睡", "來", "和"];
    if (
      message.content.includes("るーちゃん") ||
      message.content.includes("みけねこちゃん")
    ) {
      if (includesAny(message.content, subStrings)) {
        message.reply("消え失せろ");
      }
    }

    const replies = [
      {
        words: ["老ㄆㄛˊ"],
        reply:
          "https://cdn.discordapp.com/attachments/946997403578404864/957699560967376966/FB_IMG_1643680126724.jpg",
      },
      {
        words: ["pettan"],
        reply:
          "https://cdn.discordapp.com/attachments/946997403578404864/957914419852111922/FB_IMG_1643680110105.jpg",
      },
      {
        words: ["胸"],
        reply:
          "https://cdn.discordapp.com/attachments/946997403578404864/957911151394586624/FB_IMG_1638487832614.jpg",
      },
      {
        words: ["砧板", "まな板"],
        reply:
          "https://cdn.discordapp.com/attachments/946997403578404864/957914420502212698/FB_IMG_1643680054229.jpg",
      },
      {
        words: ["boing"],
        reply:
          "https://media.discordapp.net/attachments/956867669959794728/963813505750954054/FB_IMG_1648803227500.jpg",
        react: "<a:3994rushiahappy:948938443218649090>",
      },
      {
        words: ["找其他人", "外遇"],
        reply: "你再說一次？<:RushiaYandere:948941963170828328>",
      },
      {
        words: ["清潔"],
        reply:
          "https://media.discordapp.net/attachments/956867669959794728/961972142487007232/Screenshot_20220320-210121_Markup.png",
        autoDelete: true,
      },
      {
        words: ["婆"],
        reply: (msg) => {
          var splitMsg = msg.split("婆");
          if (splitMsg[2] != undefined)
            return "https://cdn.discordapp.com/attachments/956867669959794728/1037586158877679636/unknown.png";
          return Math.random() < 0.5
            ? "https://media.discordapp.net/attachments/956867669959794728/960943560117596221/FB_IMG_1628385959138.jpg"
            : "醒";
        },
      },
      {
        words: ["女友", "彼女", "老ㄆㄛˊ", "waifu".toLowerCase()],
        reply: "醒",
      },
      {
        words: [
          "床上玩",
          "露我",
          "露聖水",
          "露在",
          "露說",
          "露跟",
          "露會",
          "編故事",
          "露睡",
          "露來",
        ],
        reply: `${
          message.guild?.id === "942625037498867722"
            ? "<#963807692839862352>"
            : "<#950398610284097597>"
        }, 謝謝`,
      },
      { words: ["愛你"], reply: "我不愛你" },
      {
        words: [
          "ちゃんは大好きだよ",
          "ちゃんとけっこんしました",
          "妻になって",
          "はの夫",
          "一緒に寝る",
          "俺の嫁",
        ],
        reply: "消え失せろ",
      },
      { words: ["結婚", "窩璦妮"], reply: "滾開點" },
      { words: ["wife".toLowerCase()], reply: "wake up damn" },
    ];

    replies.forEach(({ words, reply, react, autoDelete }) => {
      if (includesAny(message.content, words)) {
        const response =
          typeof reply === "function" ? reply(message.content) : reply;
        const sentMessage = message.reply(response);
        if (react) message.react(react);
        if (autoDelete) {
          sentMessage.then((msg) => {
            setTimeout(() => msg.delete(), 1000);
          });
        }
      }
    });
  } catch (e) {
    console.log(e);
  }
});

// Music commands
const status = (queue) =>
  `Volume: \`${queue.volume}%\` | Filter: \`${
    queue.filters.names.join(", ") || "Off"
  }\` | Loop: \`${
    queue.repeatMode
      ? queue.repeatMode === 2
        ? "All Queue"
        : "This Song"
      : "Off"
  }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

const handlers = {
  playSong: (queue, song) =>
    queue.textChannel.send(
      `${client.emotes.play} | Playing \`${song.name}\` - \`${
        song.formattedDuration
      }\`\nRequested by: ${song.user}\n${status(queue)}`
    ),
  addSong: (queue, song) =>
    queue.textChannel.send(
      `${client.emotes.success} | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
    ),
  addList: (queue, playlist) =>
    queue.textChannel.send(
      `${client.emotes.success} | Added \`${playlist.name}\` playlist (${
        playlist.songs.length
      } songs) to queue\n${status(queue)}`
    ),
  error: (channel, e) => {
    if (channel)
      channel.send(
        `${client.emotes.error} | An error encountered: ${e
          .toString()
          .slice(0, 1974)}`
      );
    else console.error(e);
  },
  empty: (channel) =>
    channel.send("Voice channel is empty! Leaving the channel..."),
  searchNoResult: (message, query) =>
    message.channel.send(
      `${client.emotes.error} | No result found for \`${query}\`!`
    ),
  finish: (queue) => queue.textChannel.send("Finished!"),
  searchResult: (message, result) => {
    let i = 0;
    message.channel.send(
      `**Choose an option from below**\n${result
        .map(
          (song) => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``
        )
        .join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`
    );
  },
  searchCancel: (message) =>
    message.channel.send(`${client.emotes.error} | Searching canceled`),
  searchInvalidAnswer: (message) =>
    message.channel.send(
      `${client.emotes.error} | Invalid answer! You have to enter the number in the range of the results`
    ),
  searchDone: () => {},
};

Object.entries(handlers).forEach(([event, handler]) =>
  client.distube.on(event, handler)
);
