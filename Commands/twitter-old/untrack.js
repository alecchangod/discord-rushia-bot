const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/track.sqlite" });
const Twit = require('twit');
module.exports = {
    name: "untrack",
    aliases: ["untrack"],
    run: async (client, message, args, secret) => {
        var no = 0, // return for not tracked user
            usr_tck = 0, // don't remove channel when there are user tracking
            usid_ch = 0, //don't remove user when it is tracking in other channel 
            // untck = 0, // don't remove user_name when it is being used in other channel
            mct = message.content,
            det = mct.split(" "),
            user_name = det[1];
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
            var dat = data;
            console.log(`username is ${data.name}, ${data.screen_name}`);
            var screen_name = data.screen_name,
                user_id = dat.id_str;
            (async () => {

                //remove userid in channel 3
                var check2 = await db.get(channel_id);
                if ((check2 != null) || (check2 != undefined)) {
                    if (JSON.stringify(check2).includes(user_id) === true) {
                        (async () => {
                            await db.pull(channel_id, user_id);
                            var ch = await db.get(channel_id);
                            if (ch == []) await db.delete(channel_id);
                            else usr_tck++;
                        })();
                    }
                    else {
                        message.reply(`**@${screen_name}** wasn't tracking in <#${channel_id}>`);
                        no++
                    }
                }
                else {
                    message.reply(`**@${screen_name}** wasn't tracking in <#${channel_id}>`);
                        no++
                }

                if ((no != 0)||(usr_tck != 0)) return message.reply(`**@${screen_name}** was successfully untracked in <#${channel_id}>`);

                //remove userid_channel 2
                var check1 = await db.get(`${user_id}_ch`);
                if ((check1 != null) || (check1 != undefined)) {
                    if (JSON.stringify(check1).includes(channel_id) === true) {
                        (async () => {
                            await db.pull(`${user_id}_ch`, channel_id)
                            var usr_ch = await db.get(`${user_id}_ch`);
                            if(usr_ch == []) await db.delete(`${user_id}_ch`);
                            else usid_ch++;
                        })();
                    }
                    else {
                        message.reply(`**@${screen_name}** wasn't tracked`);
                        no++
                    }
                }
                else {
                    message.reply(`**@${screen_name}** wasn't tracked`);
                    no++
                }

                if ((no == 0)&&(usid_ch == 0)) {
                    //remove screen name
                    var check = await db.get(user_id);
                    if ((check != null) || (check != undefined)) {
                        if (JSON.stringify(check).includes(screen_name) === true) {
                            (async () => {
                                await db.delete(user_id, screen_name)
                            })();
                        }
                    }
                    }

                if ((no != 0)||(usid_ch != 0)) return message.reply(`**@${screen_name}** was successfully untracked in <#${channel_id}>`);

                //remove track 1
                var check0 = await db.get(`track`);
                if ((check0 != null) || (check0 != undefined)) {
                    if (JSON.stringify(check0).includes(user_id) === true) {
                        (async () => {
                            await db.pull('track', user_id);
                            message.reply(`**@${screen_name}** was successfully untracked.`);
                            // var tck = await db.get('track');
                            // if (tck == []) untck++;
                        })();
                    }
                    else {
                        message.reply(`**@${user_name}** wasn't tracked.`);
                        no++;
                    }
                }
                else {
                    message.reply(`**@${user_name}** wasn't tracked.`);
                    no++;
                }

                
            })();
        });
    }
}
