const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require("@discordjs/builders");
const { ApplicationCommandOptionType, ButtonStyle, PermissionsBitField } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });

module.exports = {
  data: {
    name: "setprefix",
    description: 'Set server prefix',
    options: [
      {
        name: 'new_prefix',
        type: ApplicationCommandOptionType.String,
        description: 'New prefix to be set',
        required: true,
      },
    ],
  },
  userPermissions: PermissionsBitField.Flags.ManageGuild,  
  async execute(client, interaction, args, secret, prefix, trans, langc) {
    try {
      // Check if user have permission
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply('You do not have permission.');

      // Get prefix provided
      const newprefix = interaction.options.getString('new_prefix');
      
      // Limit prefix to 5 letters
      if (newprefix.length > 5) return interaction.reply('Prefix is too long. Please keep it under 5 characters.');

      // Get interaction information
      const guildId = interaction.guildId;
      const author = interaction.user.id;

      // Save the prefix
      await db.set(`prefix_${guildId}`, newprefix);
      // Save the user name which changed the prefix
      await db.set(`prefix_c_${guildId}`, author);

      // Save the time for changing it
      const timestamp = Math.floor(Date.now() / 1000);
      await db.set(`prefix_t_${guildId}`, timestamp);

      // Check if it was saved
      const prefixFromDb = await db.get(`prefix_${guildId}`);
      const authorFromDb = await db.get(`prefix_c_${guildId}`);
      const timeFromDb = await db.get(`prefix_t_${guildId}`);

      // Give an reply after running the command
      const msg = `New prefix: ${prefixFromDb} \n set by <@${authorFromDb}> \n at <t:${timeFromDb}>`
      interaction.reply(msg);
      
    } catch (e) {
      console.log(e);
      await interaction.channel.send({ content: 'An error occurred while executing the command.'});
    }
  },
};