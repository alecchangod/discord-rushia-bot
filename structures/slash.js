let slash = [];
const { readdirSync } = require("fs");
const ascii = require("ascii-table");
let table = new ascii("Slash Commands");
table.setHeading("Slash Command", " Load status");

module.exports = async (client) => {
  readdirSync("./SlashCommands/").forEach((dir) => {
    const commands = readdirSync(`./SlashCommands/${dir}/`).filter((file) =>
      file.endsWith(".js")
    );
    for (let file of commands) {
      let pull = require(`../SlashCommands/${dir}/${file}`);
      if (pull.data && pull.data.name) {
        client.slashCommands.set(pull.data.name, pull);
        slash.push(pull.data);
        table.addRow(file, "SLASH COMMAND REGISTERED");
      } else {
        table.addRow(file, `SLASH COMMAND UNREGISTERED`);
        continue;
      }
    }
  });
  console.log(table.toString());
  client.on("ready", async () => {
    await client.application.commands.set(slash);
  });
};
