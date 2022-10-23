const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/track.sqlite" });
const Twit = require('twit');
module.exports = {
    name: "track",
    aliases: ["t"],
    run: async (client, message, args, secret) => {
        var mct = message.content
        var det = mct.split(" ")[1];
        console.log(det);
        // var grp_id = message.guild.id;
        // console.log(grp_id);
        var user_name = det;
        if (message.content.includes('#'))
            var c_id = message.content.split('#')[1];
        if (!c_id)
            var channel_id = message.channelId;
        else
            var channel_id = c_id.split('>')[0];
        console.log(channel_id)
        var test = client.channels.cache.get(channel_id);
        if (!test)
            return message.reply('must provid a valid channel id');
        if (!message.member.permissions.has("SEND_MESSAGES"))
            return message.reply('please give me send message permission in ' + det[2]);
        if (!message.member.permissions.has("EMBED_LINKS"))
            return message.reply('please give me embed link permission in ' + det[2]);

        if ((!user_name) || (user_name.length = 0))
            return message.reply('must provide a twitte user id to track!');

        message.reply(det)

        var T = new Twit({
            consumer_key: secret.TWITTER_CONSUMER_KEY,
            consumer_secret: secret.TWITTER_CONSUMER_SECRET,
            access_token: secret.TWITTER_ACCESS_TOKEN,
            access_token_secret: secret.TWITTER_ACCESS_TOKEN_SECRET,
            timeout_ms: 60 * 1000,
            strictSSL: true, // optional - requires SSL certificates to be valid.
        });

        //get screen name
        T.get('users/show', { screen_name: user_name }, function (err, data, response) {
            if (err) {
                return console.log(`User Fetch Error`),
                    console.log(err),
                    message.reply("Error while fetching user, please make sure you have entered a correct twitter screen name and it is not a private account. To check all command and the usage of the command, please use `=help`.");
            }
            console.log(data)
            var dat = data
            console.log(`username is ${data.name}, ${data.screen_name}`);
            var screen_name = data.screen_name
            var user_id = dat.id_str;
            (async () => {

                //add new track
                var check0 = await db.get(`track`);
                // let c1 = 0;
                if ((check0 != null)) {
                    if (!check0.includes(user_id)) {
                        if (check0 == []) (async () => { await db.set('track', [user_id]) })();
                        else console.log('adding screen name'), (async () => { await db.push('track', user_id) })();
                    }
                    else return console.log('user already added', check);
                    // check.forEach(a => {
                    //     if (a == grp_id) c1++
                    // }

                    // );
                    // if (c1 == 0) await db.push('track', grp_id);
                    // else console.log('grp alraedy added' + c1);
                }
                else await db.push('track', user_id);

                //put screen name
                var check = await db.get(user_id);
                if (check != null) {
                    if (!check.includes(user_id)) { console.log('adding user id'), (async () => { await db.set(user_id, screen_name) })(); }
                    else return console.log('user already tracking', check);
                }
                else await db.push(user_id, screen_name);



                


                //add userid_channel
                var check1 = await db.get(`${user_id}_ch`);
                // let c2 = 0
                if (check1 != null) {
                    if (!check1.includes(channel_id)) {
                        console.log('adding user channel'), (async () => {
                            await db.push(`${user_id}_ch`, channel_id)
                        })();
                    }
                    else return console.log('channel already added for user', check1);
                    // check1.forEach(a => {
                    //     if (a == channel_id) c2++
                    // });
                    // if (c2 === 0) await db.push(`${grp_id}_ch`, channel_id);
                    // else console.log('channel already in grp' + c2)
                }
                else await db.push(`${user_id}_ch`, channel_id);

                //add userid in channel
                var check2 = await db.get(channel_id);
                // let c2 = 0
                if (check2 != null) {
                    if (!check2.includes(user_id)) {
                        console.log('adding user into channel'), (async () => {
                            await db.push(channel_id, user_id)
                        })();
                    }
                    else return console.log('user already added in channel', check2);
                    // check1.forEach(a => {
                    //     if (a == channel_id) c2++
                    // });
                    // if (c2 === 0) await db.push(`${grp_id}_ch`, channel_id);
                    // else console.log('channel already in grp' + c2)
                }
                else await db.push(`${user_id}_ch`, channel_id);




                // await db.set(user_id, screen_name);



                // Getting an object from the database:
                await db.get(`track`).then(uid => {
                    uid.forEach(u_id => {
                        if (u_id == user_id) {
                            (async () => {
                                var c_id = await db.get(`${user_id}_ch`);
                                c_id.forEach(ch_id => {

                                    if (ch_id == channel_id) {

                                        

                                        (async () => {
                                            var a = await db.get(channel_id);
                                            a.forEach(uid => {
                                            if (uid == user_id) {
                                                (async () => {
                                                    // const c = await db.get(`${e}_c`);
                                                    var sn = await db.get(user_id);
                                                    console.log(`user=${user_id}(${sn})`);

                                                    // console.log(`${grp_id}_c = ${ch_id}`);


                                                    message.reply(`now tracking ${data.name}(${sn}) on twitter! \n message will be post to <#${ch_id}>`);
                                                })();
                                            }
                                        });

                                        })();
                                    }
                                }
                                );
                            })();
                        }
                    });
                });
            })();

        });







    }
}
