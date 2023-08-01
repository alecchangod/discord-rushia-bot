const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });
const { ApplicationCommandOptionType, PermissionsBitField } = require("discord.js");

module.exports = {
  data: {
    name: "setwelcome",
    description: 'Set welcome channel',
    options: [
      {
        name: 'channel',
        type: ApplicationCommandOptionType.Channel,
        description: 'Channel to be set as welcome channel',
        required: true,
      },
      {
        name: 'status',
        type: ApplicationCommandOptionType.String,
        description: 'Enable or disable in this server',
        required: false,
        choices: [
          {
            name: 'enable',
            value: 'enable'
          },
          {
            name: 'disable',
            value: 'disbale'
          }
        ]
      },
    ],
  },
  userPermissions: PermissionsBitField.Flags.ManageGuild,
  async execute(client, interaction, args, secret, prefix, trans, langc) {
    try {
      // Check if the interaction author have permission to delete message
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild) && (interaction.member.id != secret.me)) {
        const missing_permission = trans.strings.find(it => it.name === "missing_permission").trans;
        return interaction.reply(missing_permission);
      }

      // Get provided channel
      const channel = interaction.options.getChannel('channel');

      // Get interaction information
      const guildId = interaction.guildId;
      const author = interaction.user.id;

      // Check enable or disable
      const status = interaction.options.getString('status');
      if ((!status) || (status === "enable")) {
        const haveenabled = await db.get(`need_welcome`);
        if (!JSON.stringify(haveenabled)?.includes(interaction.guild.id)) db.push("need_welcome", interaction.guild.id);
      }
      else if ((status === "disable")) {
        const haveenabled = await db.get(`need_welcome`);
        if (JSON.stringify(haveenabled)?.includes(interaction.guild.id)) db.pull("need_welcome", interaction.guild.id);
      }

      // Save the channel
      await db.set(`welcome_${guildId}`, channel.id);
      // Save the user name which changed the prefix
      await db.set(`welcome_c_${guildId}`, author);

      // Save the time for changing it
      const timestamp = Math.floor(Date.now() / 1000);
      await db.set(`welcome_t_${guildId}`, timestamp);

      // Check if it was saved
      const channelFromDb = await db.get(`welcome_${guildId}`);
      const authorFromDb = await db.get(`welcome_c_${guildId}`);
      const timeFromDb = await db.get(`welcome_t_${guildId}`);

      // Give an reply after running the command
      const new_channel = trans.strings.find(it => it.name === "new_channel").trans;
      const set_by = trans.strings.find(it => it.name === "set_by").trans;
      const at = trans.strings.find(it => it.name === "at").trans;
      const msg = `${new_channel}: <#${channelFromDb}> \n${set_by}: <@${authorFromDb}> \n${at}: <t:${timeFromDb}>`
      interaction.reply(msg);

    } catch (e) {
      console.log(e);
      await interaction.channel.send({ content: 'An error occurred while executing the command.' });
    }
  },
};
