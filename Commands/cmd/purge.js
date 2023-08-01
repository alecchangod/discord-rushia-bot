const { PermissionsBitField } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: "purge",
    aliases: ["purge"],
    description: 'purge message after a message (ONLY less than 14 days)',
    run: async (client, message, args, secret, prefix, trans) => {
        try {
            // Check if the message author have permission to delete message
            const usr = await message.guild.members.fetch(message.author);
            const missing_permission = trans.strings.find(it => it.name === "missing_permission").trans;
            if (!usr.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
                return message.reply(missing_permission);
            }

            // Get message id provided
            var messageId = args[0];
            // MUST have one ID provided (Will work on reply one later)
            const missing_id = trans.strings.find(it => it.name === "missing_id").trans;
            if (!messageId) {
                return message.reply(missing_id);
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
            const msg_del = trans.strings.find(it => it.name === "msg_del").trans;
            const after_id = trans.strings.find(it => it.name === "after_id").trans;
            message.channel.send(`<@${message.author.id}> ${msg_del} * ${messagesDeleted} ${after_id} ${messageId}.`);

        } catch (error) {
            console.error(`Error executing msgdel command: ${error}`);
        }
    }
};
