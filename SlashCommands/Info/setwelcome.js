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
    ],
  },
  userPermissions: PermissionsBitField.Flags.ManageGuild,  
  async execute(client, interaction, args, secret, prefix, trans, langc) {
    try {
      // Check if user have permission
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply('You do not have permission.');

      // Get provided channel
      const channel = interaction.options.getChannel('channel');

      // Get interaction information
      const guildId = interaction.guildId;
      const author = interaction.user.id;

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
      const msg = `New welcome channel: <#${channelFromDb}> \n set by <@${authorFromDb}> \n at <t:${timeFromDb}>`
      interaction.reply(msg);
      
    } catch (e) {
      console.log(e);
      await interaction.channel.send({ content: 'An error occurred while executing the command.'});
    }
  },
};
