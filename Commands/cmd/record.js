const { Constants } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const fs = require("fs");
const prism = require("prism-media");
const { exec } = require("child_process");

module.exports = {
  name: "record",
  aliases: ["rec"],
  trans: "music",
  run: async (client, message, args, secret, prefix, trans) => {
    // Get translate
    var invalid_ch = trans.strings.find((it) => it.name === "invalid_ch").trans;
    var no_ch = trans.strings.find((it) => it.name === "no_ch").trans;

    let voiceChannel;
    if (args[0]) {
      voiceChannel = await client.channels.fetch(args[0]);
      if (!Constants.VoiceBasedChannelTypes.includes(voiceChannel?.type)) {
        return message.channel.send(
          `${client.emotes.error} | ${args[0]} ${invalid_ch}`
        );
      }
    }
    else if (message.member.voice.channel.id){
      voiceChannel = await client.channels.fetch(
        message.member.voice.channel.id
      );
    }

    if (!voiceChannel) {
      return message.channel.send(`${client.emotes.error} | ${no_ch}`);
    }

    console.log(voiceChannel.name);

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      selfDeaf: false,
    });

    const userStreams = new Map();
    let filename, path;
    connection.receiver.speaking.on("start", async (userId) => {
      if (userStreams.has(userId)) return;
      const user = await voiceChannel.guild.members.fetch(userId);
      let uname = user.nickname ? user.nickname : user.user.globalName;
      console.log(`${uname} (${userId}) started speaking`);
      const receiver = connection.receiver.subscribe(userId);
      path = `record/${message.guild.id}/${voiceChannel.id}/raw`;
      filename = `${userId}(${uname})_${Date.now()}`;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }

      const outStream = fs.createWriteStream(`${path}/${filename}.pcm`);
      userStreams.set(userId, { outStream, receiver });

      receiver
        .pipe(
          new prism.opus.Decoder({ rate: 48000, channels: 2, frameSize: 960 })
        )
        .pipe(outStream);
      outStream.on("finish", () => {
        console.log("Finished writing .pcm file.");

        userStreams.delete(userId);
        exec(
          `ffmpeg -f s16le -ar 48k -ac 2 -i "${path}/${filename}.pcm" "${path}/../${filename}.m4a"`
        );
        console.log("Done converting to .m4a");
      });
    });

    // detect disconnections
    client.on("voiceStateUpdate", (oldState, newState) => {
      // Check for user disconnection
      if (oldState.channelId && !newState.channelId) {
        // User disconnected from any voice channel
        let userId = oldState.id;

        // Check if the bot was recording this user's voice
        if (userStreams.has(userId)) {
          let streamData = userStreams.get(userId);

          streamData.receiver.destroy();
          streamData.outStream.end(() => {
            console.log(
              `Stream for user ${userId} has been ended due to user disconnection.`
            );
            console.log("Finished writing .pcm file.");

            userStreams.delete(userId);
            exec(
              `ffmpeg -f s16le -ar 48k -ac 2 -i "${path}/${filename}.pcm" "${path}/../${filename}.m4a"`
            );
            console.log("Done converting to .m4a");
          });
        }
      }

      // if the bot itself has been disconnected
      if (
        oldState.id === client.user.id &&
        oldState.channelId &&
        !newState.channelId
      ) {
        // clean up all streams
        for (let [userId, streamData] of userStreams) {
          streamData.receiver.destroy();
          streamData.outStream.end(() => {
            console.log(
              `Stream for user ${userId} has been ended due to bot disconnection.`
            );
            console.log("Finished writing .pcm file.");

            userStreams.delete(userId);
            exec(
              `ffmpeg -f s16le -ar 48k -ac 2 -i "${path}/${filename}.pcm" "${path}/../${filename}.m4a"`
            );
            console.log("Done converting to .m4a");
          });
        }
        userStreams.clear();
      }
    });
  },
};
