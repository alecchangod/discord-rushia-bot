const client = require('../../index.js')
const Discord = require('../../index.js')
const PREFIX = '='
const secret = require('../../config.json')
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/prefix.sqlite" }); 
//command
client.on('messageCreate', async message => {
  // console.log(message)
    if(message.author.bot) return;
    if(!message.guild) return;
    const a = await db.get(`prefix_${message.guild.id}`);
    var prefix = await db.get(`prefix_${message.guild.id}`)
    if(prefix == null) {
    var prefix = PREFIX;
    } else {
      prefix = prefix
    }
    if(!message.content.startsWith(prefix)) return;
    if(!message.member) message.member = await message.guild.members.fetch(message);
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if(cmd.length == 0) return;
    let command = client.commands.get(cmd)
    if(!command) command = client.commands.get(client.aliases.get(cmd));
    if(command) command.run(client, message, args, secret, prefix)
  });


//message log
client.on('messageCreate', async message => {
  if (message.channel.parent.id === "974997417315414016") return;  
  if(!message.guild) return;
  const cmd = 'send-logger';
  let command = client.commands.get(cmd)
  if(!command) command = client.commands.get(client.aliases.get(cmd));
  if(command) command.run(client, message, secret, Discord)
});


//dm detect
client.on('messageCreate', async (message) => {
  if (message.channel.type == 'DM') {
  const cmd = 'pm-logger';
  let command = client.commands.get(cmd)
  if(!command) command = client.commands.get(client.aliases.get(cmd));
  if(command) command.run(client, message, secret)
}
});


//self protect
client.on('messageCreate', async message => {
  try {
    if (message.author.id === secret.botid) return;
    if (message.reference.messageId) {
      if ((message.content.toLowerCase().includes('滾')) || (message.content.toLowerCase().includes('閉嘴')) || (message.content.toLowerCase().includes('草')) || (message.content.toLowerCase().includes('幹')) || (message.content.toLowerCase().includes('操')) || (message.content.toLowerCase().includes('安靜')) || (message.content.toLowerCase().includes('賣插')) || (message.content.toLowerCase().includes('賣吵')) || (message.content.toLowerCase().includes('麥插')) || (message.content.toLowerCase().includes('麥吵'))) {
        const repliedTo = await message.channel.messages.fetch(message.reference.messageId);
        if (repliedTo.author.id === secret.botid) {
          message.reply('蛤')
        };

      }
      if ((message.content.toLowerCase().includes('早安')) ) {
        const repliedTo = await message.channel.messages.fetch(message.reference.messageId);
        if (repliedTo.author.id === secret.botid) {
          message.reply('早安')
        };

      }
      if ((message.content.toLowerCase().includes('怎麽了')) ) {
        const repliedTo = await message.channel.messages.fetch(message.reference.messageId);
        if (repliedTo.author.id === secret.botid) {
          message.reply('不知道')
        };

      }
      if ((message.content.toLowerCase().includes('蛤三小')) ) {
        const repliedTo = await message.channel.messages.fetch(message.reference.messageId);
        if (repliedTo.author.id === secret.botid) {
          message.reply('早安 <:RushiaYandere:948941963170828328>')
        };

      }
      else if ((message.content.toLowerCase().includes('蛤')) ) {
        const repliedTo = await message.channel.messages.fetch(message.reference.messageId);
        if (repliedTo.author.id === secret.botid) {
          message.reply('早安')
        };

      }
    }
  } catch (e) { }
});



  