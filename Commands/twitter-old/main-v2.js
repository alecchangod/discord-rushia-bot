const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/track.sqlite" });
const { ETwitterStreamEvent, TweetStream, TwitterApi, ETwitterApiError } = require('twitter-api-v2');
module.exports = {
    name: 'twitter-main-v2',
    aliases: ['m'],
    description: 'start twitter track',
    run: async (client, secret) => {
        // Creates clients

        // var T = new Twit({
        //     consumer_key: secret.TWITTER_CONSUMER_KEY,
        //     consumer_secret: secret.TWITTER_CONSUMER_SECRET,
        //     access_token: secret.TWITTER_ACCESS_TOKEN,
        //     access_token_secret: secret.TWITTER_ACCESS_TOKEN_SECRET,
        //     timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
        //     strictSSL: true,     // optional - requires SSL certificates to be valid.
        // })

        // OAuth 1.0a (User context)
        const userClient = new TwitterApi({
            appKey: secret.TWITTER_CONSUMER_KEY,
            appSecret: secret.TWITTER_CONSUMER_SECRET,
            // Following access tokens are not required if you are
            // at part 1 of user-auth process (ask for a request token)
            // or if you want a app-only client (see below)
            accessToken: secret.TWITTER_ACCESS_TOKEN,
            accessSecret: secret.TWITTER_ACCESS_TOKEN_SECRET,
        });

        // OAuth2 (app-only or user context)
        // Create a client with an already known bearer token
        // const appOnlyClient = new TwitterApi('bearerToken');
        // OR - you can also create a app-only client from your consumer keys -
        // const appOnlyClientFromConsumer = await userClient.appLogin();

        // const v2Client = client.v2;

        // We also think of users who test v2 labs endpoints :)
        // const v2LabsClient = client.v2.labs;

        // Use proxy
        // var url = require('url');
        // var https = require('https');
        var HttpsProxyAgent = require('https-proxy-agent');

        // HTTPS proxy to connect to
        // twitter-api-v2 will always use HTTPS
        const proxy = secret.HTTP_PROXY || 'https://1.1.1.1:3000';

        // create an instance of the `HttpProxyAgent` class with the proxy server information
        const httpAgent = new HttpsProxyAgent(proxy);

        // Instantiate helper with the agent
        const bearerToken = secret.TWITTER_BEARER_TOKEN;
        // const twitter_client = new TwitterApi(bearerToken, { httpAgent });
        const twitter_client = new TwitterApi(bearerToken);



        
        const stream = await twitter_client.v2.searchStream();

        // Awaits for a tweet
        stream.on(
            // Emitted when Node.js {response} emits a 'error' event (contains its payload).
            ETwitterStreamEvent.ConnectionError,
            err => console.log('Connection error!', err),
        );

        stream.on(
            // Emitted when Node.js {response} is closed by remote or using .close().
            ETwitterStreamEvent.ConnectionClosed,
            () => console.log('Connection has been closed.'),
        );

        stream.on(
            // Emitted when a Twitter payload (a tweet or not, given the endpoint).
            ETwitterStreamEvent.Data,
            eventData => console.log('Twitter has sent something:', eventData, '\n \ntweet id:', eventData.data.id, 'content:', eventData.data.text, 'from:', eventData.includes.users),
            // console.log('tweet id:', eventData.data.id, 'text', eventData.data.text)
        );

        stream.on(
            // Emitted when a Twitter sent a signal to maintain connection active
            ETwitterStreamEvent.DataKeepAlive,
            () => console.log('Twitter has a keep-alive packet.'),
        );

        // Enable reconnect feature
        stream.autoReconnect = true;

        // Be sure to close the stream where you don't want to consume data anymore from it
        // stream.close();

        // -- Alternative usage --

        // You can also use async iterator to iterate over tweets!
        for await (const { data } of stream) {
            console.log('This is my tweet:', data);
        }

        // rules
        const rules = await twitter_client.v2.streamRules();

        // Log every rule ID
        console.log(`rules: ${rules}`)
        console.log(rules.data.map(rule => rule.id));

        








        // // start tracking
        // var user_id = await db.get(`track`);
        // console.log(`bot is tracking ${user_id}`)
        // user_id?.forEach(u_id => {
        //     console.log(`user id: ${u_id}`);
        //     (async () => {
        //         var c_id = await db.get(`${u_id}_ch`);
        //         c_id.forEach(ch_id => {
        //             (async () => {
        //                 var a = await db.get(ch_id);
        //                 a.forEach(uid => {
        //                     (async () => {
        //                         T.get('users/show', { id: u_id }, function (err, data, response) {
        //                             if (err) {
        //                                 console.log(`User Fetch Error`);
        //                                 console.log(err);
        //                             };
        //                             const screen_name = data.screen_name;

        //                             (async () => {
        //                                 await db.set(u_id, screen_name);
        //                             })();
        //                         });
        //                         const sn = await db.get(u_id);
        //                         try {
        //                             var stream = T.stream('statuses/filter', { follow: [uid] })
        //                             console.log(`now following ${sn} on twitter!`);

        //                             stream.on('tweet', function isReply(tweet) {
        //                                 if ((tweet.retweeted_status)) {
        //                                     //only show owner tweets
        //                                     if (tweet.user.id == uid) {
        //                                         var url = "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;
        //                                         var n = tweet.user.screen_name;
        //                                         if (ch_id) {
        //                                             client.channels.fetch(ch_id).then(channel => {
        //                                                 channel.send(`**@${n}** just retweeted <t:${Math.floor(new Date() / 1000)}:F> \n${url}`)
        //                                             }).catch(err => {
        //                                                 console.log(err)
        //                                             })
        //                                         }
        //                                     };
        //                                 }
        //                             });
        //                             stream.on('tweet', function isReply(tweet) {
        //                                 if ((tweet.in_reply_to_status_id
        //                                     || tweet.in_reply_to_status_id_str
        //                                     || tweet.in_reply_to_user_id
        //                                     || tweet.in_reply_to_user_id_str
        //                                     || tweet.in_reply_to_screen_name)) {
        //                                     //only show owner tweets
        //                                     if (tweet.user.id == uid) {
        //                                         var url = "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;
        //                                         var n = tweet.user.screen_name;
        //                                         if (ch_id) {
        //                                             client.channels.fetch(ch_id).then(channel => {
        //                                                 channel.send(`**@${n}** just post a new reply <t:${Math.floor(new Date() / 1000)}:F> \n${url}`)
        //                                             }).catch(err => {
        //                                                 console.log(err)
        //                                             })
        //                                         }
        //                                     };
        //                                 }
        //                             });
        //                             stream.on('tweet', function isReply(tweet) {
        //                                 try {
        //                                     if ((tweet.retweeted_status
        //                                         || tweet.in_reply_to_status_id
        //                                         || tweet.in_reply_to_status_id_str
        //                                         || tweet.in_reply_to_user_id
        //                                         || tweet.in_reply_to_user_id_str
        //                                         || tweet.in_reply_to_screen_name)) return; {
        //                                         //only show owner tweets
        //                                         if (tweet.user.id == uid) {
        //                                             var url = "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;
        //                                             var n = tweet.user.screen_name;
        //                                             if (ch_id) {
        //                                                 client.channels.fetch(ch_id).then(channel => {
        //                                                     channel.send(`**@${n}** has post a new post <t:${Math.floor(new Date() / 1000)}:F> \n${url}`)
        //                                                 }).catch(err => {
        //                                                     console.log(err)
        //                                                 })
        //                                             }
        //                                         }
        //                                     }
        //                                 } catch (e) { }
        //                             });
        //                         } catch (e) { }
        //                     })()
        //                 })
        //             })()
        //         }
        //         )
        //     })()
        // })


    }
}
