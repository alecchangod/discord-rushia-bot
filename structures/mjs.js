const { readdirSync } = require("fs");
const ascii = require("ascii-table");
const table = new ascii("ESM Commands");
table.setHeading("COMMANDS", " LOAD STATUS");

module.exports = async (client) => {
  const dirs = readdirSync("./Commands/mjs/");

  for (const dir of dirs) {
    if (dir === "cmd") {
      const cmdFiles = readdirSync(`./Commands/mjs/${dir}`).filter((file) =>
        file.endsWith(".mjs")
      );

      for (const file of cmdFiles) {
        const pull = await import(`../Commands//mjs/${dir}/${file}`);

        if (pull.name) {
          client.cmd.set(pull.name, pull);
          table.addRow(file, "COMMAND REGISTERED");
        } else {
          table.addRow(file, "COMMAND UNREGISTERED");
          continue;
        }

        if (pull.aliases && Array.isArray(pull.aliases)) {
          pull.aliases.forEach((alias) => client.aliases.set(alias, pull.name));
        }
      }
    }
  }

  console.log(table.toString());
};
