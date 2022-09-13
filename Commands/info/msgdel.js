module.exports = {
  name: "msgdel", 
  aliases: ["m"],
  run: async (client, message) => {
    const user = message.mentions.users.first();
    // Parse Amount
    var amount = !!parseInt(message.content.split(' ')[1]) ? parseInt(message.content.split(' ')[1]) : parseInt(message.content.split(' ')[2])
    if (!amount) return message.reply('Must specify an amount to delete!');
    if (!amount && !user) return message.reply('Must specify a user and amount, or just an amount, of messages to purge!');
    amount++;
    // Fetch messages (will be filtered and lowered up to max amount requested)
    message.channel.messages.fetch({
      limit: amount,
    }).then((msg) => {
    //  if (user) {
    //  const filterBy = user ? user.id : Client.user.id;
    //  msg = new Array(msg)
    //  msg = msg.filter(m => m.author.id === filterBy).slice(0, amount);
    //  }
     message.channel.bulkDelete(msg).catch(error => console.log(error.stack));
    });
}
}
