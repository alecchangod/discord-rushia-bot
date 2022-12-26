const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/track.sqlite" });
const Twit = require('twit');
module.exports = {
  name: 'twitter-main',
  aliases: ['m'],
  description: 'start twitter track',
  run: async (client, secret) => {
    // Creates clients
    var T = new Twit({
      consumer_key: secret.TWITTER_CONSUMER_KEY,
      consumer_secret: secret.TWITTER_CONSUMER_SECRET,
      access_token: secret.TWITTER_ACCESS_TOKEN,
      access_token_secret: secret.TWITTER_ACCESS_TOKEN_SECRET,
      timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
      strictSSL: true,     // optional - requires SSL certificates to be valid.
    })

    // start tracking
    var user_id = await db.get(`track`);
    console.log(`bot is tracking ${user_id}`)
    user_id.forEach(u_id => {
      console.log(`user id: ${u_id}`);
      (async () => {
        var c_id = await db.get(`${u_id}_ch`);
        c_id.forEach(ch_id => {
          (async () => {
            var a = await db.get(ch_id);
            a.forEach(uid => {
              (async () => {
                T.get('users/show', { id: u_id }, function (err, data, response) {
                  if (err) {
                    console.log(`User Fetch Error`);
                    console.log(err);
                  };
                  const screen_name = data.screen_name;

                  (async () => {
                    await db.set(u_id, screen_name);
                  })();
                });
                const sn = await db.get(u_id);
                try {
                  var stream = T.stream('statuses/filter', { follow: [uid] })
                  console.log(`now following ${sn} on twitter!`)

                  stream.on('tweet', function isReply(tweet) {
                    if ((tweet.retweeted_status)) {
                      //only show owner tweets
                      if (tweet.user.id == uid) {
                        var url = "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;
                        var n = tweet.user.screen_name;
                        if (ch_id) {
                          client.channels.fetch(ch_id).then(channel => {
                            channel.send(`**@${n}** just retweeted <t:${Math.floor(new Date() / 1000)}:F> \n${url}`)
                          }).catch(err => {
                            console.log(err)
                          })
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
                        var url = "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;
                        var n = tweet.user.screen_name;
                        if (ch_id) {
                          client.channels.fetch(ch_id).then(channel => {
                            channel.send(`**@${n}** just post a new reply <t:${Math.floor(new Date() / 1000)}:F> \n${url}`)
                          }).catch(err => {
                            console.log(err)
                          })
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
                          var url = "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;
                          var n = tweet.user.screen_name;
                          if (ch_id) {
                            client.channels.fetch(ch_id).then(channel => {
                              channel.send(`**@${n}** has post a new post <t:${Math.floor(new Date() / 1000)}:F> \n${url}`)
                            }).catch(err => {
                              console.log(err)
                            })
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
