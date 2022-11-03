const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/track.sqlite" });
module.exports = {
  name: 'main',
  aliases: ['m'],
  description: 'get twitter post',
  run: async (client, secret, message, T) => {
    // if (message.author.id !== secret.me) return;
    var user_id = await db.get(`track`)
    user_id.forEach(u_id => {
      (async () => {
        var c_id = await db.get(`${u_id}_ch`)
        c_id.forEach(ch_id => {


          (async () => {
            var a = await db.get(ch_id)

            a?.forEach(uid => {
              (async () => {
                // const c = await db.get(`${e}_c`);




                T.get('users/show', { id: u_id }, function (err, data, response) {
                  if (err) {
                    console.log(`User Fetch Error`);
                    console.log(err);
                    message.reply("Error while fetching user, please make sure you have entered a correct twitter screen name and it is not a private account. To check all command and the usage of the command, please use `=help`.")
                  }
                  console.log(data);
                  console.log(`username is ${data.name}, ${data.screen_name}`)
                  const screen_name = data.screen_name

                    (async () => {
                      await db.set(u_id, screen_name);
                    })()
                })();
                const sn = await db.get(u_id);
                // console.log(`user=${uid}(${sn})`)

                // console.log(`${g_id}_c = ${ch_id}`)


                // message.reply(`now tracking ${uid}(${sn}) on twitter! \n message will be post to <#${ch_id}>`)

                try {
                  var stream = T.stream('statuses/filter', { follow: [uid] })
                  console.log(`now following ${sn} on twitter!`)

                  stream.on('tweet', function isReply(tweet) {
                    if ((tweet.retweeted_status)) {
                      //only show owner tweets
                      if (tweet.user.id == uid) {
                        var url = "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;
                        var n = tweet.user.screen_name;
                        try {
                          client.channels.fetch(ch_id).then(channel => {
                            channel.send(`${sn}just post a new tweet <t:${Math.floor(new Date() / 1000)}:F> \n${url}`)
                          }).catch(err => {
                            console.log(err)
                          })
                        } catch (error) {
                          console.error(error);
                        }
                      };
                    }
                  });
                  stream.on('tweet', function isReply(tweet) {
                    if ((tweet.in_reply_to_status_id
                      || tweet.in_reply_to_status_id_str
                      || tweet.in_reply_to_user_id
                      || tweet.in_reply_to_user_id_str
                      || tweet.in_reply_to_screen_name)) {
                      //only show owner tweets
                      if (tweet.user.id == uid) {
                        var url = "twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;
                        var n = tweet.user.screen_name;
                        try {
                          client.channels.fetch(ch_id).then(channel => {
                            channel.send(`${sn}just post a new reply <t:${Math.floor(new Date() / 1000)}:F> \n${url}`)
                          }).catch(err => {
                            console.log(err)
                          })
                        } catch (error) {
                          console.error(error);
                        }
                      };
                    }
                  });
                  stream.on('tweet', function isReply(tweet) {
                    try {
                      if ((tweet.retweeted_status
                        || tweet.in_reply_to_status_id
                        || tweet.in_reply_to_status_id_str
                        || tweet.in_reply_to_user_id
                        || tweet.in_reply_to_user_id_str
                        || tweet.in_reply_to_screen_name)) return; {
                        //only show owner tweets
                        if (tweet.user.id == uid) {
                          var url = "twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;
                          var n = tweet.user.screen_name;
                          try {
                            client.channels.fetch(ch_id).then(channel => {
                              channel.send(`${sn}just post a has retweeted <t:${Math.floor(new Date() / 1000)}:F> \n${url}`)
                            }).catch(err => {
                              console.log(err)
                            })
                          } catch (error) {
                            console.error(error);
                          }
                        }
                      }
                    } catch (e) { }
                  });

                } catch (e) { }
              })()

            })

          })()

        }
        )
      })()

    })
  }


}
