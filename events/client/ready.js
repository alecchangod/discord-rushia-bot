// Imports the client libraries
const client = require("../../index.js");
const secret = require("../../config.json");
const cron = require("cron");
const exec = require("child_process").exec;
const { spawn } = require("node:child_process");
const fs = require("fs");

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

async function start_download_vid(time, server, channelid, link, path) {
  let download_vid = new cron.CronJob(time, async () => {
    const guild = client.guilds.cache.get(server);
    const channel = guild.channels.cache.get(channelid);

    const command = `yt-dlp`;
    const args = [
      // "--downloader ffmpeg",
      // '--downloader-args "ffmpeg:-t 180"',
      "--live-from-start",
      // "--sub-langs all",
      "-f",
      "bv[ext=mp4]+ba[ext=m4a]",
      "--embed-thumbnail",
      "--write-thumbnail",
      "--write-description",
      "--write-info-json",
      "-o",
      `${path}/%(title)s-%(id)s.%(ext)s`,
      link,
    ];

    const child = spawn(command, args);
    let log = "";

    child.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
      log += data;
    });

    child.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    child.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
      console.log(log);
      fs.writeFileSync(`${path}/down.log`, log, "utf8");
    });
  });
  download_vid.start();
}

// Self-role
async function handleSelfRole(guildid, channel, messageid, reactionid, roleid) {
  const sr_log = await client.channels.fetch(secret.self_role_log_channel);
  const guild = client.guilds.cache.get(guildid);
  const message = await guild.channels.cache
    .get(channel)
    .messages.fetch(messageid);
  const reaction = client.emojis.cache.find((emoji) => emoji.id === reactionid);
  message.react(reaction);
  const collector = message.createReactionCollector({
    filter: (reaction, user) => reaction.emoji.id === reactionid && !user.bot,
  });
  collector.on("collect", async (reaction, user) => {
    const link = `https://discord.com/channels/${reaction.message.guildId}/${reaction.message.channelId}/${reaction.message.id}`;
    const role = guild.roles.cache.get(roleid);
    const member = guild.members.cache.get(user.id);
    if (member.roles.cache.has(role.id)) {
      await member.roles.remove(role);
      reaction.users.remove(user.id);
      sr_log.send(
        `**Self-role**\n\n${link}\nRemoved role \`\`${role.name}\`\` from \`\`${user.tag}\`\``
      );
    } else {
      await member.roles.add(role);
      reaction.users.remove(user.id);
      sr_log.send(
        `**Self-role**\n\n${link}\nAdded role \`\`${role.name}\`\` to \`\`${user.tag}\`\``
      );
    }
  });
}

// Ready
client.on("ready", async () => {
  // Rushia is now online!
  let str = `${client.user.tag} is ready on ${client.guilds.cache.size} servers.`;
  console.log(str);
  str += `\n\`\`\``;
  // Show which group Rushia was in
  client.guilds.cache.forEach((guild) => {
    let channel = `${guild.name}(${guild.id}), ${guild.memberCount} users, ${guild.roles.cache.size} roles, ${guild.channels.cache.size} channels`;
    console.log(channel);
    str += `\n${channel}`;
  });
  // Online logging
  if (secret.online_log_channel) {
    const log = await client.channels.fetch(secret.online_log_channel);
    // Send to log channel
    log.send(
      `**${client.user.tag} was now online!** \n<t:${Math.floor(
        Date.now() / 1000
      )}>\n\n${str}\`\`\``
    );
  } else
    console.log(
      "Online log channel id wasn't found. Please provide one in ``secret.online_log_channel``."
    );
  // Set status
  client.user.setPresence({
    activities: [{ name: "誰在做夢", type: 3 }],
    status: "idle",
    clientStatus: "PS5",
  });
  // Start schedule messages
  startScheduledMessage(
    "00 00 12 * * *",
    secret.bot_grp2,
    secret.bot_grp2_chat,
    "你各位別當死魚堆"
  );

  // Start to handle self-role
  await handleSelfRole(
    "949153367609987124",
    "963802334482284595",
    "963802394045583370",
    "958407417559908382",
    "964140235401355304"
  );

  // await start_download_vid(
  //   "20 41 * * * *",
  //   "1079103834015662130",
  //   "1079103835131351082",
  //   "https://www.youtube.com/watch?v=5Sknv5MOBSI",
  //   "/home/alecchangod/backup/tmp/aqua"
  // );
});
