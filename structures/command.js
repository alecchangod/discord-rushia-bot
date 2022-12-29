const { readdirSync } = require('fs');
const ascii = require('ascii-table');
const wait = require('node:timers/promises').setTimeout;
let table = new ascii("Commands");
table.setHeading('COMMANDS', ' LOAD STATUS');

module.exports = async (client) => {
    readdirSync('./Commands/').forEach(async dir => {
        if (dir === "cmd") {
            const cmd = readdirSync(`./Commands/${dir}`).filter(file => file.endsWith('.js'));
            for (let file of cmd) {
                let pull0 = require(`../Commands/${dir}/${file}`);
                if (pull0.name) {
                    client.cmd.set(pull0.name, pull0);
                    table.addRow(file, 'COMMAND REGISTERED')
                } else {
                    table.addRow(file, 'COMMAND UNREGISTERED')
                    continue;
                } if (pull0.aliases && Array.isArray(pull0.aliases)) pull0.aliases.forEach(alias => client.aliases.set(alias, pull0.name));
            };
        }
        if (dir === "info") {
            const cmd = readdirSync(`./Commands/${dir}`).filter(file => file.endsWith('.js'));
            for (let file of cmd) {
                let pull1 = require(`../Commands/${dir}/${file}`);
                if (pull1.name) {
                    client.info.set(pull1.name, pull1);
                    table.addRow(file, 'COMMAND REGISTERED')
                } else {
                    table.addRow(file, 'COMMAND UNREGISTERED')
                    continue;
                } if (pull1.aliases && Array.isArray(pull1.aliases)) pull1.aliases.forEach(alias => client.aliases.set(alias, pull1.name));
            };
        }
        if (dir === "twitter") {
            const cmd = readdirSync(`./Commands/${dir}`).filter(file => file.endsWith('.js'));
            for (let file of cmd) {
                let pull2 = require(`../Commands/${dir}/${file}`);
                if (pull2.name) {
                    client.twitter.set(pull2.name, pull2);
                    table.addRow(file, 'COMMAND REGISTERED')
                } else {
                    table.addRow(file, 'COMMAND UNREGISTERED')
                    continue;
                } if (pull2.aliases && Array.isArray(pull2.aliases)) pull2.aliases.forEach(alias => client.aliases.set(alias, pull2.name));
            };
        }
        if (dir === "music") {
            const cmd = readdirSync(`./Commands/${dir}`).filter(file => file.endsWith('.js'));
            for (let file of cmd) {
                let pull3 = require(`../Commands/${dir}/${file}`);
                if (pull3.name) {
                    client.music.set(pull3.name, pull3);
                    table.addRow(file, 'COMMAND REGISTERED')
                } else {
                    table.addRow(file, 'COMMAND UNREGISTERED')
                    continue;
                } if (pull3.aliases && Array.isArray(pull3.aliases)) pull3.aliases.forEach(alias => client.aliases.set(alias, pull3.name));
            };
        }
    });
    await wait(1500);
    console.log(table.toString());
}

