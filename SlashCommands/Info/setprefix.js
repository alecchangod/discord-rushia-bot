const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require("@discordjs/builders")
const { ApplicationCommandOptionType, ButtonStyle } = require("discord.js")

const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "database/prefix.sqlite" }); 
const { Permissions } = require('discord.js');
module.exports = {
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
    run : async(client, interaction, args, prefix) => {
        const member = interaction.guild.members.cache.get(interaction.user.id)
        if(!member.permissions.has('ADMINISTRATOR')) return interaction.reply('笑死你沒權限');
         var newprefix = interaction.options.getString('prefix');
         if(newprefix.length > 5) return interaction.reply('前綴太長了w \n 5個字内, 謝謝');

    // self calling async function just to get async
    // Setting an object in the database:
    await db.set(`prefix_${interaction.guild.id}`, newprefix);
    console.log(`prefix of ${interaction.guild.name} (${interaction.guild.id})has been set to ${newprefix}`)

    const author = "`" + interaction.user.tag + "`"

    await db.set(`c_${interaction.guild.id}`, author);
    console.log(`prefix of ${interaction.guild.name} was set by ${author}`)

    await db.set(`t_${interaction.guild.id}`, Math.floor(new Date() / 1000));
    console.log(`prefix of ${interaction.guild.name} was set at ${Math.floor(new Date() / 1000)}`)



    // Getting an object from the database:
    const a = await db.get(`prefix_${interaction.guild.id}`);
    console.log(`${interaction.guild.name}'s newprefix was checked working: \n \n ${a}`)

    const aa = await db.get(`c_${interaction.guild.id}`);
    console.log(`${interaction.guild.name} was checked set by: \n \n \ ${aa}`)

    const aaa = await db.get(`t_${interaction.guild.id}`);
    console.log(`${interaction.guild.name} was checked set by: \n \n  ${aaa} `)


    const msg = `current prefix: ${a} \n set by ${aa} \n in <t:${aaa}>`
    interaction.reply(msg)

}
}