const { readdirSync } = require('fs');
const ascii = require('ascii-table');
let table = new ascii("Commands");
table.setHeading('COMMANDS', ' LOAD STATUS');

module.exports = (client) => {
    readdirSync('./Commands/').forEach(dir => {
        const commands = readdirSync(`./Commands/${dir}`).filter(file => file.endsWith('.js'));
        for(let file of commands) {
            let pull0 = require(`../Commands/cmd/${file}`);
            if(pull0.name) {
                client.cmd.set(pull0.name, pull0);
                table.addRow(file, 'COMMAND REGISTERED')
            } else {
                table.addRow(file, 'COMMAND UNREGISTERED')
                continue;
            } if(pull0.aliases && Array.isArray(pull0.aliases)) pull0.aliases.forEach(alias => client.aliases.set(alias, pull0.name));

            let pull = require(`../Commands/info/${file}`);
            if(pull.name) {
                client.info.set(pull.name, pull);
                table.addRow(file, 'COMMAND REGISTERED')
            } else {
                table.addRow(file, 'COMMAND UNREGISTERED')
                continue;
            } if(pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));

            let pull1 = require(`../Commands/twitter/${file}`);
            if(pull.name) {
                client.twitter.set(pull1.name, pull1);
                table.addRow(file, 'COMMAND REGISTERED')
            } else {
                table.addRow(file, 'COMMAND UNREGISTERED')
                continue;
            } if(pull1.aliases && Array.isArray(pull1.aliases)) pull1.aliases.forEach(alias => client.aliases.set(alias, pull1.name));

            let pull2 = require(`../Commands/music/${file}`);
            if(pull2.name) {
                client.music.set(pull2.name, pull2);
                table.addRow(file, 'COMMAND REGISTERED')
            } else {
                table.addRow(file, 'COMMAND UNREGISTERED')
                continue;
            } if(pull2.aliases && Array.isArray(pull2.aliases)) pull2.aliases.forEach(alias => client.aliases.set(alias, pull2.name))
        }
    });
    console.log(table.toString());
}

