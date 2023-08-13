const { PermissionsBitField, ApplicationCommandOptionType, AttachmentBuilder } = require('discord.js');
const fetch = require('node-fetch');

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
            required: false,
          },
          {
            name: 'file',
            type: ApplicationCommandOptionType.Attachment,
            description: 'The file to send',
            required: false,
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
            required: false,
          },
          {
            name: 'file',
            type: ApplicationCommandOptionType.Attachment,
            description: 'The file to send',
            required: false,
          },
        ],
      },
    ],
    trans: "say",
  },
  async execute(client, interaction, args, secret, trans) {
    try {
      // Allow these users only
      const allowedUser = [secret.me, "805785752074977300", "1122862133043015751", "737133459222298694", "967404236407197736"];

      // Check if user was allowed to run this command
      let isAllowed = allowedUser.includes(interaction.member.id)

      // If they were allowed
      if (isAllowed) {
        // Get message to send
        const content = interaction.options.getString('content');
        var i_file = await interaction.options.getAttachment('file');
        const messageId = interaction.options.getSubcommand() === 'reply' ? interaction.options.getString('messageid') : null;
        const no_file_content = trans.strings.find(it => it.name === "nothing").trans;
        if ((!i_file) && (!content)) return interaction.reply({ content: no_file_content, ephemeral: true });;
        await interaction.deferReply({ ephemeral: true });

        // If there were file provided,
        // Buffer the file and set the filename
        let attach;
        if (i_file?.attachment) {
          var file = await fetch(i_file.attachment);
          const buffer = await file.buffer();
          attach = new AttachmentBuilder(buffer);
          var filename = `\`${i_file.name}\``;
        }

        // Get translations
        const sent = trans.strings.find(it => it.name === "sent").trans;

        // Check if message id was provided
        // If yes, send the message as a reply
        if (messageId) {
          const guild = client.guilds.cache.get(interaction.guildId);
          const message = await guild.channels.cache.get(interaction.channelId).messages.fetch(messageId);
          if (message) {
            message.reply(file ? { content: content, files: [attach] } : { content: content });
          }
          else {
            const invalid_id = trans.strings.find(it => it.name === "invalid_id").trans;
            return interaction.editReply({ content: invalid_id, ephemeral: true });
          }
        }
        // If not, send the message normally 
        else {
          interaction.channel.send(file ? { content: content, files: [attach] } : { content: content });
        }

        interaction.editReply(file ? { content: `${content ? `\`${content}\` && ` : ""} ${filename} ${sent} <#${interaction.channelId}>`, files: [attach], ephemeral: true } : { content: `\`${content}\` ${sent} <#${interaction.channelId}>`, ephemeral: true });
      }
      else {
        const no_perm = trans.strings.find(it => it.name === "no_perm").trans;
        return interaction.reply(no_perm);
      }
    } catch (error) {
      console.log(`Error running say command: ${error}`);
    }
  },
};