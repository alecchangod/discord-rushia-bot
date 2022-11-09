module.exports = {
    name: "pm-logger", 
    aliases: ["p"],
    run: async(client, message, secret) => {
        client.channels.fetch(secret.PMlog).then(channel => {
        if(message.stickers.size > 0) {channel.send('人:' + message.author.tag + ' , 訊息: 啊就貼圖(X ')}
        else if (message.attachments.size > 0) {
            var attachments = message.attachments;
            for (let file of attachments) {
              message.attachments.forEach(a=>{
                      if (a.size > 10485760) {
                        if (message.content.length == 0) var data = `人: ${message.author.tag} , 附件: ${a.url}`
                        else if (message.content.length > 0) var data = `人: ${message.author.tag} , 訊息: ${message.content} , 附件: ${a.url}`
                var channel1 = client.channels.fetch(secret.PMlog).then(channel1 => {
                channel1.send({
                  content: data
                });
              });
              }
              else var channel1 = client.channels.fetch(secret.PMlog).then(channel1 => {
                if (message.content.length == 0) var data = `人: ${message.author.tag} , 附件:`
                else if (message.content.length > 0) var data = `人: ${message.author.tag} , 訊息: ${message.content} , 附件:`
                channel1.send({
                  files: Array.from(message.attachments.values()),
                  content: data
                });
              });
              })
        
            }
          }

        else if (message.reference){
            const repliedTo = message.channel.messages.fetch(message.reference.messageId);
            if(!repliedTo.author) return channel.send('人:' + message.author.tag + '訊息: ' + message.content, { split: true })
            else channel.send('人:' + message.author.tag + ' , 前文(?: ' + repliedTo.author.tag + '\n ' + repliedTo.content + '訊息: ' + message.content, { split: true })
        } 
      
        else { channel.send('人:' + message.author.tag + '訊息: ' + message.content, { split: true }) }})
        
        }  
    }