const client = require('../../index.js');

client.on("interactionCreate", async(interaction) => {
    if(interaction.isChatInputCommand()) {

        const cmd = client.slashCommands.get(interaction.commandName);
        if(!cmd)
        return interaction.reply({
            content: "An Error Has Occered In Slash Command"
        });
        if(!interaction.guildId) return interaction.reply("using slash command in DM is not yet supported.")

        const guild =  client.guilds.cache.get(interaction.guildId);
        const args = [];

        for(let option of interaction.options.data) {
            if(option.type === "SUB_COMMAND") {
                if(option.name) args.push(option.name);
                option.options ?.forEach((x) => {
                    if(x.value)
                    args.push(x.value);
                })
            } else if(option.value)
            args.push(option.value);
        }
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);
        cmd.run(client, interaction, guild, interaction.options);
    }
})