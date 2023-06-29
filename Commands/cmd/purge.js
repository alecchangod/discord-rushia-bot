const { PermissionsBitField } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: "purge",
    aliases: ["m", "msgdel"],
    description: 'purge message after a message (ONLY less than 14 days)',
    run: async (client, message, args, secret, prefix, trans, langc) => {
        try {
            // const user = message.mentions.users.first();
            const usr = await message.guild.members.fetch(message.author);

            if (!usr.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
                return message.reply("笑死你沒權限");
            }

            var messageId = args[0];

            if (!messageId) {
                return message.reply('Must specify a message ID to delete!');
            }

            let messagesDeleted = 0;
            let fetchedMessages;
            let foundMessage = false;
            let count = 0;

            do {
                var limit = 100;
                fetchedMessages = await message.channel.messages.fetch({ limit: limit });
                fetchedMessages.forEach((msg) => {
                    if (!foundMessage) {
                        if (msg.id === messageId) {
                            foundMessage = true;
                            console.log("message found")
                        }
                        else {
                            if (msg.id > messageId) {
                                console.log("not this, bye :)");
                                if ((foundMessage) && (count < 100)) {
                                    msg.delete();
                                    messagesDeleted++;
                                }
                                count++;

                            }
                        };


                    }
                });

                while (count >= 100) {
                    message.channel.bulkDelete(fetchedMessages).catch(error => console.log(error.stack));
                    count = 0;
                    break;
                };

                while ((count < 100) && (count > 1)) {
                    fetchedMessages = await message.channel.messages.fetch({ limit: count });
                    message.channel.bulkDelete(fetchedMessages).catch(error => console.log(error.stack));
                    count = 0;
                    break;
                };

                await wait(1000);

            } while (!foundMessage);

            message.channel.send(`<@${message.author.id}> I have deleted ${messagesDeleted} messages after message ID ${messageId}.`);

        } catch (error) {
            console.error(`Error executing msgdel command: ${error}`);
        }
    }
};