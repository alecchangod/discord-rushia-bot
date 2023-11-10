// Imports the client library
const client = require("../../index.js");
const secret = require("../../config.json");
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });
const {
  PermissionsBitField,
  ApplicationCommandOptionType,
  AttachmentBuilder,
} = require("discord.js");
const fetch = require("node-fetch");
const wait = require("node:timers/promises").setTimeout;

// Command
client.on("interactionCreate", async (interaction) => {
  let file;
  let attach;
  let str = `Guild: ${interaction.guild?.name}\n`;
  str += `${
    interaction.channel.parent
      ? `Channel parent: ${interaction.channel.parent.name}`
      : ""
  }\n`;
  str += `Channel: ${interaction.channel.name}\n`;
  str += `User: ${interaction.member} ${
    interaction.user.discriminator === "0" ? "@" : ""
  }${interaction.user.username}${
    interaction.user.discriminator === "0"
      ? ""
      : `#${interaction.user.discriminator}`
  }\n`;
  str += `Command: ${interaction.commandName}`;
  str += interaction.options?._hoistedOptions.size ? "\nOptions:" : "";

  interaction.options?._hoistedOptions.forEach(async (options) => {
    str += `\n${options.name}: ${
      options.type != 11 ? options.value : options.attachment.name
    }`;
    if (options.type === 11) {
      var file_ = await fetch(options.attachment.url);
      const buffer = await file_.buffer();
      attach = new AttachmentBuilder(buffer);
      file = options.attachment;
      client.channels.fetch(secret.slash_log_channel).then(async (channel) => {
        await wait(1000);
        channel.send({
          content: `Attachments \`${options.attachment.name}\` for the options \`${options.name}\``,
          files: [attach],
        });
      });
    }
  });

  client.channels.fetch(secret.slash_log_channel).then(async (channel) => {
    channel.send(str);
  });

  // Command handling
  if (interaction.isChatInputCommand()) {
    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd)
      return interaction.reply({
        content: "An Error Has Occured In Slash Command",
      });
    if (!interaction.guildId)
      return interaction.reply(
        "Using slash command in DM is not yet supported."
      );

    const guild = client.guilds.cache.get(interaction.guildId);
    const args = [];

    for (let option of interaction.options.data) {
      if (option.type === ApplicationCommandOptionType.Subcommand) {
        if (option.name) args.push(option.name);
        option.options?.forEach((x) => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }

    // Get language code from database or use server's one
    var langc =
      (await db.get(`lang_${interaction.guild.id}`)) ||
      interaction.guild.preferredLocale;
    let trans;
    if (cmd.data.trans)
      trans = require(`../../trans/${langc}/${cmd.data.trans}.json`);
    else trans = require(`../../trans/${langc}/${cmd}.json`);
    interaction.member = interaction.guild.members.cache.get(
      interaction.user.id
    );
    cmd.execute(
      client,
      interaction,
      args,
      secret,
      trans,
      langc,
      guild,
      interaction.options
    );
  }
});
