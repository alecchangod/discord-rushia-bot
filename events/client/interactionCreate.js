// Imports the client library
const client = require('../../index.js')
const trans = require('../../trans.json')
const secret = require('../../config.json')
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/server.sqlite" });
const { PermissionsBitField, ApplicationCommandOptionType } = require('discord.js');

// Command
client.on("interactionCreate", async (interaction) => {
    console.log(interaction.options?._hoistedOptions);
    // Log slash usage
    client.channels.fetch(secret.slash_log_channel).then(async channel => {
        channel.send(`Guild: ${interaction.guild?.name} \n ${interaction.channel.parent ? `Channel parent: ${interaction.channel.parent.name}` : ""} \n Channel: ${interaction.channel.name} \n User: ${interaction.member} ${interaction.user.tag} \n Command: ${interaction.commandName}`)
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
            if (option.type === ApplicationCommandOptionType.Subcommand) {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }

        // Get language code from database or use server's one
        var langc = await db.get(`lang_${interaction.guild.id}`) || interaction.guild.preferredLocale;
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);
        cmd.execute(client, interaction, args, secret, trans, langc, guild, interaction.options);
    }

})
