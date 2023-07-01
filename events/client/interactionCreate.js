// Imports the client library
const client = require('../../index.js')
const trans = require('../../trans.json')
const secret = require('../../config.json')

// Command
client.on("interactionCreate", async (interaction) => {
    // Log slash usage
    client.channels.fetch('1076853031682965517').then(async channel => {
        channel.send(`Guild: ${interaction.guild?.name} \n Channel parent: ${interaction.channel.parent.name} \n Channel: ${interaction.channel.name} \n User: ${interaction.member} ${interaction.user.tag} \n Command: ${interaction.commandName}`)
    }
    );

    // Command handling
    if (interaction.isChatInputCommand()) {
        const cmd = client.slashCommands.get(interaction.commandName);
        if (!cmd) return interaction.reply({ content: "An Error Has Occured In Slash Command" });
        if (!interaction.guildId) return interaction.reply("Using slash command in DM is not yet supported.");

        const guild = client.guilds.cache.get(interaction.guildId);
        const args = [];

        for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }

        interaction.member = interaction.guild.members.cache.get(interaction.user.id);
        cmd.run(client, interaction, args, secret, trans, guild, interaction.options);
    }

})
