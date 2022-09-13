module.exports = {
    name: "untrack",
    aliases: ["u"],
    run: async (client, message, args, secret) => {
        const { QuickDB } = require("quick.db");
        const db = new QuickDB({ filePath: "database/track.sqlite" });
        const Twit = require('twit');
        var mct = message.content
        var det = mct.split(" ")[1];
        console.log(det);
        var grp_id = message.guild.id;
        console.log(grp_id);
        var user_name = det;
        var used = 0;
        if (message.content.includes('#'))
            var c_id = message.content.split('#')[1];
        if (!c_id)
            var channel_id = message.channel.id;
        else
            var channel_id = c_id.split('>')[0];

        var ch = await db.get(channel_id)
        var test = client.channels.cache.get(channel_id);
        if (!test)
            return message.reply('must provid a valid channel id');
        if ((!user_name) || (user_name.length = 0))
            return message.reply('must provide a twitte user id to untrack!');
        if (ch == null) return message.reply(`can't find <#${channel_id}>in database. Make sure you have entered a correct channel id to untrack ${user_name} on twitter, or try run the command again in that channel.`)
        console.log(channel_id)


        message.reply(det);

        var T = new Twit({
            consumer_key: secret.TWITTER_CONSUMER_KEY,
            consumer_secret: secret.TWITTER_CONSUMER_SECRET,
            access_token: secret.TWITTER_ACCESS_TOKEN,
            access_token_secret: secret.TWITTER_ACCESS_TOKEN_SECRET,
            timeout_ms: 60 * 1000,
            strictSSL: true, // optional - requires SSL certificates to be valid.
        });

        (async () => {


            // Getting an object from the database:
            await db.get(`track`).then(gid => {
                gid.forEach(g_id => {
                    (async () => {
                        var cid = await db.get(`${g_id}_ch`)
                        cid.forEach(ch_id => {


                            (async () => {
                                var a = await db.get(ch_id)




                                a.forEach(uid => {



                                    T.get('users/show', { id: uid }, function (err, data, response) {
                                        if (err) {
                                            console.log(`User Fetch Error`);
                                            console.log(err);
                                            message.reply("Error while fetching user, please make sure you have entered a correct twitter screen name. To check all command and the usage of the command, please use `=help`.")
                                        }

                                        var screen_name = data.screen_name;
                                        console.log(screen_name)
                                        if (det == screen_name) {
                                            var user_id = data.id_str;
                                            (async () => { await db.pull(channel_id, user_id) })()
                                        }

                                        (async () => {
                                            await db.get(uid).then(() => {
                                                if (screen_name == user_name) {
                                                    used++
                                                }
                                            })
                                        })()

                                        if (used == 0) { (async () => { await db.delete(user_id) })() };
                                    })();
                                })

                            })()

                        }
                        )
                    })()

                })
            })
        })();


        (async () => {

            const ch_used = await db.get(channel_id)
            if (ch_used.length < 4)
                await db.pull(`${grp_id}_ch`, channel_id);

            const gp_used = await db.get(`${grp_id}_ch`)
            if (gp_used.length < 4)
                await db.delete(`${grp_id}_ch`)
                await db.pull('track', grp_id);

            message.reply(`successfully untrack ${user_name} on twitter!`)
        })()




    }
}