const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/track.sqlite" });
const Twit = require('twit');
const { PermissionsBitField } = require('discord.js');
module.exports = {
    name: "track",
    aliases: ["t"],
    description: 'track twitter user',
    run: async (client, message, args, secret) => {
        var track1 = 0; // return for tracked user
        var mct = message.content;
        var det = mct.split(" ");
        var user_name = det[1];
        if ((!user_name) || (user_name.length = 0))
            return message.reply('must provide a twitte user id to track!');
        console.log(`user_name: ${user_name}`);
        if (message.content.includes('#'))
            var c_id = message.content.split('#')[1];
        if (!c_id)
            var channel_id = message.channelId;
        else
            var channel_id = c_id.split('>')[0];
        console.log(`channel_id: ${channel_id}`)
        var test = client.channels.cache.get(channel_id);
        if (!test)
            return message.reply('must provid a valid channel id');
        if (!message.member.permissions.has(PermissionsBitField.Flags.SendMessages))
            return message.reply('please give me send message permission in ' + det[2]);
        if (!message.member.permissions.has(PermissionsBitField.Flags.EmbedLinks))
            return message.reply('please give me embed link permission in ' + det[2]);

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
                    message.reply("Error while fetching user, please make sure you have entered a correct twitter screen name and it is not a private account.");
            }
            var dat = data
            console.log(`username is ${data.name}, ${data.screen_name}`);
            var screen_name = data.screen_name
            var user_id = dat.id_str;
            (async () => {

                //add new track
                var check0 = await db.get(`track`);
                if ((check0 != null) || (check0 != undefined)) {
                    if (JSON.stringify(check0).includes(user_id) === false) {
                        console.log('adding user id');
                        (async () => {
                            await db.push('track', user_id)
                        })();
                    }
                    else console.log('user already added', check0);
                }
                else await db.push('track', user_id);

                //put screen name
                var check = await db.get(user_id);
                if ((check != null) || (check != undefined)) {
                    if (JSON.stringify(check).includes(screen_name) === false) {
                        console.log('adding screen name')
                            (async () => {
                                await db.set(user_id, screen_name)
                            })();
                    }
                    else console.log('user already tracking', check);
                }
                else await db.set(user_id, screen_name);

                //add userid_channel
                var check1 = await db.get(`${user_id}_ch`);
                if ((check1 != null) || (check1 != undefined)) {
                    if (JSON.stringify(check1).includes(channel_id) === false) {
                        console.log('adding user channel')
                            (async () => {
                                await db.push(`${user_id}_ch`, channel_id)
                            })();
                    }
                    else console.log('channel already added for user', check1);
                }
                else await db.push(`${user_id}_ch`, channel_id);

                //add userid in channel
                var check2 = await db.get(channel_id);
                if ((check2 != null) || (check2 != undefined)) {
                    if (JSON.stringify(check2).includes(user_id) === false) {
                        console.log('adding user into channel');
                        (async () => {
                            await db.push(channel_id, user_id)
                        })();
                    }
                    else {
                        console.log('user already added in channel', check2);
                        message.reply(`${screen_name} already tracking in <#${channel_id}>`);
                        track1++
                    }
                }
                else await db.push(channel_id, user_id);

                if (track1 = 1) return; //return for tracked user

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
                                                        var sn = await db.get(user_id);
                                                        console.log(`user=${user_id}(${sn})`);
                                                        message.reply(`now tracking ${data.name}(${sn}) on twitter! \n message will be post to <#${ch_id}>`);
                                                    })();
                                                }
                                            });
                                        })();
                                    };
                                }
                                );
                            })();
                        };
                    });
                });
            })();
        });
    }
}
