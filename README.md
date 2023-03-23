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

#### Use with prefix + {command name}
Example: =ping
By default, the prefix is "=". You can change that with the setprefix command.

- bl - blacklist some words and delete it when detected
REQUIRE MANAGE MESSAGES PERMISSION TO USE
- Useage: {prefix}bl add/del {word}
- getprefix - get your current prefix detail. (who set it, when, what is it)
- help - get commands name and description(still working on it right now)
- ping - get the ping of the bot
- say - send something as the bot
- Useage: {prefix}say {content}
- msgdel - delete multiple message at once
REQUIRE MANAGE MESSAGES PERMISSION TO USE
- Useage: {prefix}msgdel {amount}
- svrinfo - get current server information (Language, prefix)
- setlang - set group language
- setprefix - change your server prefix(in 5 char)
REQUIRE ADMIN PERMISSION TO USE
- Useage: {current prefix}setprefix {new prefix}
- spam - spam message in a channel.
REQUIRE MANAGE MESSAGES PERMISSION TO USE
- Useage: {prefix}spam {amount} {content}
- time - get current time(yeah it is just such a useless command)
- tl - translate something to another language
(if you want to translate something that have a space inside use the slash command version instead)
- Useage: {prefix}tl {content} {target language code} {original language code(check lang.json for the code. If any code wan't there, please tell me inside the support channel or just open a issue in github page.)}
- warn - warn a user(can't warn admin)
REQUIRE ADMIN/TIMEOUT MEMBERS PERMISSION TO USE
- Useage: {prefix} warn {tag the target user here} {reason for warning}

#### Use with slash command
Give the bot permission to create slash command and just type "/" in the chat box and command will appear.
You can choose opition for the command.

##### music
- music command was done already, will add usage soon

### Feature planned to add.
- log - log message deletion/update to a log channel(if you have a channel named "log" then it is forced to enable by now. Will add command to change later. 
- more accurate role change 
- language per server (done but only for message translating, more work needed for this features to work on all command)
- calculator 
- join message 
- twitter(track/untrack/delete/ping role/translate) (done but was broken due to twitter api changes)
- bot status 
- leave server logging 
- manage role 
- count message sent by a user(if discord api allow) 
- leveling system(rank for user) 
- schedule message 

### If you have any suggestion plesase tell me in the support channel. Thanks a lot!
