const { MessageCollector, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');

module.exports = {
  data: {
    name: 'delmsgs',
    description: 'Delete a certain number of new messages from a specific user in a specific period of time',
    options: [
      {
        name: 'target',
        type: ApplicationCommandOptionType.User,
        description: 'The user whose messages you want to delete',
        required: true,
      },
      {
        name: 'count',
        type: ApplicationCommandOptionType.Integer,
        description: 'The number of messages to delete',
        required: true,
      },
      {
        name: 'time',
        type: ApplicationCommandOptionType.Integer,
        description: 'The amount of minutes to listen to',
        required: true,
      },
    ],
  },
    userPermissions: PermissionsBitField.Flags.ManageMessages,
    async execute(client, interaction, args, secret, trans, langc, guild) {
    const targetUser = interaction.options.getUser('target');
    const deleteCount = interaction.options.getInteger('count');
    let time = interaction.options.getInteger('time');
    time = time * 60000;

    // Filter for MessageCollector - only collect messages of target user
    const filter = m => m.author.id === targetUser.id;

    // Create a new collector with a time limit of 10 minutes (600000 ms)
    const collector = interaction.channel.createMessageCollector({ filter, max: deleteCount, time: time });

    collector.on('end', async collected => {
      for (const [, message] of collected) {
        try {
          await message.delete();
        } catch (error) {
          console.error('Failed to delete message: ', error);
        }
      }
    });

    await interaction.reply(`Started deleting ${deleteCount} messages from ${targetUser.tag}`);
  }
}