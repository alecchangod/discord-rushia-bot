module.exports = {
    name: "join", 
    aliases: ["j"],
    run: async(client, message, secret, member) => {
        try {                  
            if (member.guild.id == secret.grp) {
                const channelId = secret.channelID
                try {
                      (member.guild.channels.fetch(channelId)).then((channel => {
                        if (channel.guild == secret.grp) {
                          channel.send('欸有新人~')
                        }
                      }))
                    } catch (e) { console.log(e) };
                    if (!member.message.author.bot) {
                      member.send('早安')
                    }
                  }


            if (member.guild.id == secret.grp1) {
                    const channelId1 = secret.channelID1 
                    try {
                      (member.guild.channels.fetch(channelId1)).then((channel1 => {
                        if (channel1.guild == secret.grp1) {
                          channel1.send('欸有新人~')
                        }
                      }))
                    } catch (e) { console.log(e) }
                  }
                
          } catch (e) {
            console.log(e)
          }
    }
  }