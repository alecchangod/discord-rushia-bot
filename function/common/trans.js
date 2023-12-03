const fs = require("fs");
async function trans(cmd, langc, str) {
  let file_exist = fs.existsSync(`trans/${langc}/${cmd}.json`);
  const file = file_exist ? require(`../../trans/${langc}/${cmd}.json`) : null;
  const default_file = require(`../../trans/en-US/${cmd}.json`);
  let translations = {};
  str.forEach((key) => {
    let found = file_exist
      ? file.strings.find((it) => it.name === key)
      : default_file.strings.find((it) => it.name === key);
    if (found) translations[key] = found.trans;
    else
      translations[key] = default_file.strings.find(
        (it) => it.name === key
      ).trans;
  });
  return translations;
}

module.exports = trans;
