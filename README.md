<h1 style="text-align: center;">
<br> Rushia </br>
</h1>

### About the bot
Rushia is a bot written by [alecchangod](https://github.com/alecchangod) in [discord.js](https://discord.js.org/#/)

# [Add rushia to your server](https://discord.com/api/oauth2/authorize?client_id=953567399687364659&permissions=8&scope=bot%20applications.commands)
It will require admin permission(all permission) by default. If you don't like that, you can use [this link](https://discord.com/api/oauth2/authorize?client_id=953567399687364659&permissions=2068063845568&scope=bot%20applications.commands) instead. Incase any feature doesn't work, just tell me. I'll updated the link.

## Suggestion/bugs
If you have any suggestion or found bug please tell me in the [discord support channel](https://discord.gg/utRrnKWdbG).

### Current feature 

#### Chatbox command
- Check [wiki](https://github.com/alecchangod/discord-rushia-bot/wiki/Command-Useage) for useage
Example: =ping
By default, the prefix is "=". You can change that with the setprefix command.

- bl - blacklist some words and delete it when detected
<br/>REQUIRE MANAGE MESSAGES PERMISSION TO USE<br/>
- getprefix - get detail about your server's prefix
- help - get commands name and description(still working on it right now)
- ping - get the ping of the bot
- purge - delete all message after the specific message. **DUE TO DISCORD API LIMIT, BOT CAN ONLY DELETE MESSAGE WHICH ISN'T OLDER THAN 14 DAYS**
<br/>REQUIRE MANAGE MESSAGES PERMISSION TO USE<br/>
- say - send something as the bot (only for approved user)
- setwelcome - set the welcome channel to welcome new user
<br/>REQUIRE MANAGE GUILD PERMISSION TO USE<br/>
- msgdel - delete multiple message at once
<br/>REQUIRE MANAGE MESSAGES PERMISSION TO USE<br/>
- svrinfo - get current server information (Language, prefix)
- setlang - set group language
<br/>REQUIRE MANAGE GUILD PERMISSION TO USE<br/>
- setprefix - change your server prefix(in 5 char)
<br/>REQUIRE MANAGE GUILD PERMISSION TO USE<br/>
- ss - screenshot of provided website (might disblae later due to security issue)
- spam - spam message in a channel.
<br/>REQUIRE MANAGE MESSAGES PERMISSION TO USE<br/>
- time - get current time(yeah it is just such a useless command)
- tl - translate something to another language
- warn - warn a user(can't warn admin)
<br/>REQUIRE MODERATE MEMBERS PERMISSION TO USE<br/>

#### Use with slash command
Give the bot permission to create slash command and just type "/" in the chat box and command will appear.
<br/>You can choose opition for the command.<br/>

##### music
- Already done, check `help` command for their name. Will update here soon :)

#### And more soon

### Feature planned to add.
- log - log message deletion/update to a log channel(if you have a channel named "log" then it is forced to enable by now. Will add command to change later.
- language per server (done but need help on translating file in trans/)
- custom welcoming message
- bot status (owner only for now)
- leave server logging 
- manage role 
- count message sent by a user (high chance that it won't be implented due to discord api limit)
- leveling system(rank for user) 
- schedule message (done but need a command to manage it)
- self-role (done but need a command to manage it)
- and many more wip...

### Dropped feature
- twitter (track/untrack/delete/ping role/translate) **dropped and won't add back due to twitter api changes**

### If you have any suggestion plesase tell me in the support channel. Thanks a lot!
