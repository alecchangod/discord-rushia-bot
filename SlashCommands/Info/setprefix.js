const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require("@discordjs/builders")
const { ApplicationCommandOptionType, ButtonStyle } = require("discord.js")

const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/prefix.sqlite" }); 
const { Permissions } = require('discord.js');
module.exports = {
    data: {
    name : 'setprefix', 
    aliases : ['sp'], 
    description : 'set prefix/serer', 
    options: [
        {
            name: 'prefix',
            description: 'enter the new prefix',
            type: ApplicationCommandOptionType.String,
            require: true
        }
    ],
},
    async execute(client, interaction, args, secret, trans, langc, guild) {
        const member = interaction.guild.members.cache.get(interaction.user.id)
        if(!member.permissions.has('ADMINISTRATOR')) return interaction.reply('笑死你沒權限');
         var newprefix = interaction.options.getString('prefix');
         if(newprefix.length > 5) return interaction.reply('前綴太長了w \n 5個字内, 謝謝');

    // self calling async function just to get async
    // Setting an object in the database:
    await db.set(`prefix_${interaction.guild.id}`, newprefix);
    const author = "`" + interaction.user.tag + "`"
    await db.set(`c_${interaction.guild.id}`, author);
    await db.set(`t_${interaction.guild.id}`, Math.floor(new Date() / 1000));

    // Getting an object from the database:
    const a = await db.get(`prefix_${interaction.guild.id}`);
    const aa = await db.get(`c_${interaction.guild.id}`);
    const aaa = await db.get(`t_${interaction.guild.id}`);
    const msg = `current prefix: ${a} \n set by ${aa} \n in <t:${aaa}>`
    interaction.reply(msg)

}
}
