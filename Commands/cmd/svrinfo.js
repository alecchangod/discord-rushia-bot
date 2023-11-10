const serverinfo = require("../../function/common/serverinfo.js");

module.exports = {
  name: "Server Info",
  aliases: ["svrinfo"],
  description: "Get server info",
  trans: "serverinfo",
  run: async (client, message, args, secret, prefix, trans) => {
    await serverinfo(client, message, trans);
  },
};
