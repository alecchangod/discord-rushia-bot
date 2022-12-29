const { readdirSync } = require('fs');
const ascii = require('ascii-table');
const wait = require('node:timers/promises').setTimeout;
let table = new ascii("ESM Commands");
table.setHeading('COMMANDS', ' LOAD STATUS');

module.exports = async (client) => {
    readdirSync('./Commands/mjs/').forEach(async dir => {
        if (dir === "cmd") {
            const cmd = readdirSync(`./Commands/mjs/${dir}`).filter(file => file.endsWith('.mjs'));
            for (let file of cmd) {
                let pull = await import(`../Commands//mjs/${dir}/${file}`)
                if (pull.name) {
                    client.cmd.set(pull.name, pull);
                    table.addRow(file, 'COMMAND REGISTERED')
                } else {
                    table.addRow(file, 'COMMAND UNREGISTERED')
                    continue;
                } if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));

            };
        }
    });
    await wait(1500);
    console.log(table.toString());
}

