const { readdirSync } = require('fs');
const ascii = require('ascii-table');
const wait = require('node:timers/promises').setTimeout;
let table = new ascii("Commands");
table.setHeading('COMMANDS', ' LOAD STATUS');


const loadCommands = (client, dir) => {
    const cmd = readdirSync(`./Commands/${dir}`).filter(file => file.endsWith('.js'));
    for (let file of cmd) {
        let pull = require(`../Commands/${dir}/${file}`);
        if (pull.name) {
            client[dir].set(pull.name, pull);
            table.addRow(file, `${dir} COMMAND REGISTERED`);
        } else {
            table.addRow(file, `${dir} COMMAND UNREGISTERED`);
            continue;
        }
        if (pull.aliases && Array.isArray(pull.aliases)) {
            pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
        }
    }
};

module.exports = async (client) => {
    const dirs = ["cmd", "base", "music"];
    dirs.forEach(dir => loadCommands(client, dir));
    await wait(1500);
    console.log(table.toString());
};