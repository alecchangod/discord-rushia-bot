const { readdirSync } = require('fs');
const ascii = require('ascii-table');
let table = new ascii("Commands");
table.setHeading('COMMANDS', ' LOAD STATUS');

module.exports = (client) => {
    readdirSync('./Commands/').forEach(dir => {
        if (dir === "cmd"){const cmd = readdirSync(`./Commands/${dir}`).filter(file => file.endsWith('.js'));
        for(let file of cmd) {
            let pull0 = require(`../Commands/${dir}/${file}`);
            console.log(pull0);
            if(pull0.name) {
                client.cmd.set(pull0.name, pull0);
                table.addRow(file, 'COMMAND REGISTERED')
            } else {
                table.addRow(file, 'COMMAND UNREGISTERED')
                continue;
            } if(pull0.aliases && Array.isArray(pull0.aliases)) pull0.aliases.forEach(alias => client.aliases.set(alias, pull0.name));
        };}
        if (dir === "info"){const cmd = readdirSync(`./Commands/${dir}`).filter(file => file.endsWith('.js'));
        for(let file of cmd) {
            let pull0 = require(`../Commands/${dir}/${file}`);
            console.log(pull0);
            if(pull0.name) {
                client.info.set(pull0.name, pull0);
                table.addRow(file, 'COMMAND REGISTERED')
            } else {
                table.addRow(file, 'COMMAND UNREGISTERED')
                continue;
            } if(pull0.aliases && Array.isArray(pull0.aliases)) pull0.aliases.forEach(alias => client.aliases.set(alias, pull0.name));
        };}
        if (dir === "twitter"){const cmd = readdirSync(`./Commands/${dir}`).filter(file => file.endsWith('.js'));
        for(let file of cmd) {
            let pull0 = require(`../Commands/${dir}/${file}`);
            console.log(pull0);
            if(pull0.name) {
                client.twitter.set(pull0.name, pull0);
                table.addRow(file, 'COMMAND REGISTERED')
            } else {
                table.addRow(file, 'COMMAND UNREGISTERED')
                continue;
            } if(pull0.aliases && Array.isArray(pull0.aliases)) pull0.aliases.forEach(alias => client.aliases.set(alias, pull0.name));
        };}
        if (dir === "music"){const cmd = readdirSync(`./Commands/${dir}`).filter(file => file.endsWith('.js'));
        for(let file of cmd) {
            let pull0 = require(`../Commands/${dir}/${file}`);
            console.log(pull0);
            if(pull0.name) {
                client.music.set(pull0.name, pull0);
                table.addRow(file, 'COMMAND REGISTERED')
            } else {
                table.addRow(file, 'COMMAND UNREGISTERED')
                continue;
            } if(pull0.aliases && Array.isArray(pull0.aliases)) pull0.aliases.forEach(alias => client.aliases.set(alias, pull0.name));
        };}
    });
    console.log(table.toString());
}

