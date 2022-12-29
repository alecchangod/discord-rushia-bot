const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require("@discordjs/builders")
const { ApplicationCommandOptionType, ButtonStyle, PermissionsBitField } = require("discord.js")

module.exports = {
  name: "msgdel", 
  description: 'purge message to delete',
  options: [
        {
            name: 'amount',
            description: 'enter the amount of message that you want to delete',
            type: 3,
            require: true
        }
    ],
  run: async (client, interaction) => {
    // check if user have permission
    var usr = await message.guild.members.fetch(message.author)
    if (usr.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
    // Parse Amount
    var amount = Number(interaction.options.getString('amount'));
    if (amount === "NaN") return interaction.reply({ content: ("please provide a valid number."), ephemeral: true });
    if (amount > 100) return interaction.reply({ content: ("max amount of message to delete allowed is 100."), ephemeral: true });
    // Fetch messages (will be filtered and lowered up to max amount requested)
    interaction.channel.messages.fetch({
      limit: amount,
    }).then((msg) => {
    //  if (user) {
    //  const filterBy = user ? user.id : Client.user.id;
    //  msg = new Array(msg)
    //  msg = msg.filter(m => m.author.id === filterBy).slice(0, amount);
    //  }
     interaction.channel.bulkDelete(msg).catch(error => console.log(error.stack));
     interaction.reply({ content: (`I have deleted ${amount} messages in <#${interaction.channel.id}> .`), ephemeral: true });
    });
  }
  else message.reply("笑死你沒權限")
}
}
