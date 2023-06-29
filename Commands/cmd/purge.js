const { PermissionsBitField } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: "Spurge",
    aliases: ["spurge", "purge"],
    description: 'purge message after a message (ONLY less than 14 days)',
    run: async (client, message, args, secret, prefix, trans, langc) => {
        try {
            // const user = message.mentions.users.first();

            // Check if the message author have permission to delete message
            const usr = await message.guild.members.fetch(message.author);
            if (!usr.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
                return message.reply("笑死你沒權限");
            }

            // Get message id provided
            var messageId = args[0];
            // MUST have one ID provided (Will work on reply one later)
            if (!messageId) {
                return message.reply('Must specify a message ID to delete!');
            }

            // Start counting
            let messagesDeleted = 0;
            let fetchedMessages;
            let foundMessage = false;
            let count = 0;

            // Start to fetch message
            while (!foundMessage) {
                // Fetch 100 message everytime (Discord API limit)
                var limit = 100;
                fetchedMessages = await message.channel.messages.fetch({ limit: limit });
                fetchedMessages.forEach((msg) => {
                    // If haven't found the required message yet
                    if (!foundMessage) {
                        // Check message ID
                        // If found
                        if (msg.id === messageId) {
                            // Set foundMessage to true. It will stop fetching message
                            foundMessage = true;
                        }
                        // If not yet found
                        else {
                            // If the message is newer than the required message
                            if (msg.id > messageId) {
                                // Check to use bulkDelete (1) or (2)
                                count++;

                            }
                        };


                    }
                });
                // bulkDelete (1)
                // If haven't fetched the required message yet
                while (count >= 100) {
                    // Delete all 100 message fetched
                    message.channel.bulkDelete(fetchedMessages).catch(error => console.log(error.stack));
                    // Increase messageDeleted counting
                    messagesDeleted += 100;
                    // Reset count
                    count = 0;
                    break;
                };
                // bulkDelete (2)
                // If fetched the required message
                while ((count < 100) && (count > 1)) {
                    // Delete all message newer than the required message
                    fetchedMessages = await message.channel.messages.fetch({ limit: count });
                    message.channel.bulkDelete(fetchedMessages).catch(error => console.log(error.stack));
                    // Increase messageDeleted counting
                    messagesDeleted += count;
                    // Reset count
                    count = 0;
                    break;
                };
                // Wait for 1 second before fetching again
                await wait(1000);

            };
            // Give a reply after deleted all requierd message
            message.channel.send(`<@${message.author.id}> I have deleted ${messagesDeleted} messages after message ID ${messageId}.`);

        } catch (error) {
            console.error(`Error executing msgdel command: ${error}`);
        }
    }
};
