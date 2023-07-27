const { PermissionsBitField, ApplicationCommandOptionType } = require('discord.js');
module.exports = {
  data: {
    name: "say",
    description: 'send message as bot(approved user only for now)',
    options: [
      {
        name: 'message',
        type: ApplicationCommandOptionType.Subcommand,
        description: 'Send a message',
        options: [
          {
            name: 'content',
            type: ApplicationCommandOptionType.String,
            description: 'The content of the message',
            required: true,
          },
        ],
      },
      {
        name: 'reply',
        type: ApplicationCommandOptionType.Subcommand,
        description: 'Reply to a message',
        options: [
          {
            name: 'messageid',
            type: ApplicationCommandOptionType.String,
            description: 'The ID of the message to reply to',
            required: true,
          },
          {
            name: 'content',
            type: ApplicationCommandOptionType.String,
            description: 'The content of the message',
            required: true,
          },
        ],
      },
    ],
    // userPermissions: PermissionsBitField.Flags.ManageMessages,
  },
  async execute(client, interaction, args, secret, trans, langc, guild) {
    try {
      // Allow these roles in server (1) and (2)
      // const allowedRolesGrp1 = ["test", "元首", "管理員", "神志不清的天才寶特瓶"]; // rushia chin server
      // const allowedRolesGrp2 = ["大哥", "管理員"]; // bot testing group
      const allowedUser = [secret.me, "805785752074977300", "1122862133043015751", "737133459222298694"];

      // Check if user was allowed to run this command. If not, their interaction will be ignored.
      let isAllowed = allowedUser.includes(interaction.member.id)
      // let isAllowedGrp1 = interaction.guild.id === secret.grp1 && interaction.member.roles.cache.some(role => allowedRolesGrp1.includes(role.name));
      // let isAllowedGrp2 = interaction.guild.id === secret.grp2 && interaction.member.roles.cache.some(role => allowedRolesGrp2.includes(role.name));

      // If they were allowed
      if (isAllowed) {
        // Get message to send
        const content = interaction.options.getString('content');
        const messageId = interaction.options.getSubcommand() === 'reply' ? interaction.options.getString('messageid') : null;

        // Check if the user was replying to another message
        // If they were, send the message as a reply
        if (messageId) {
          const guild = client.guilds.cache.get(interaction.guildId);
          const message = await guild.channels.cache.get(interaction.channelId).messages.fetch(messageId);
          if (message) {
            message.reply(content);
            interaction.reply({ content: `${content} has been sent to <#${interaction.channelId}>`, ephemeral: true });
          }
          else return interaction.reply({ content: `Please provide a valid message id.`, ephemeral: true });
        }
        // If not, send the message normally 
        else {
          interaction.channel.send(content);
          interaction.reply({ content: `${content} has been sent to <#${interaction.channelId}>`, ephemeral: true });
        }
      }
      else return interaction.reply("笑死你沒權限");
    } catch (error) {
      console.log(`Error running say command: ${error}`);
    }
  },
};