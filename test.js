// (async () => { const captureWebsite = await import('./node_modules/capture-website/index.js'); })().then(async()=>{
//   await captureWebsite.file('https://twitter.com', './screenshot/screenshot0.png', {
//     emulateDevice: 'Desktop',
//     fullPage: true,
//     darkMode: true
//   });});
  
// const puppeteer = require('puppeteer');

// (async () => {
  
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto('http://twitter.com');
//   await page.screenshot({ path: 'screenshot/screenshot1.png' });
//   await browser.close();
// })();

const moduleSpecifier = './Commands/mjs/ss.mjs';
  import(moduleSpecifier).then(module => {
    var args = 'https://medium.com/@mariokandut/how-to-dynamically-load-esm-in-cjs-b39668a6038'
    module.run(args);
    // → logs 'Hi from the default export!'
    // module.doStuff();
    // // → logs 'Doing stuff…'
  });

// const { readdirSync } = require('fs');
// const ascii = require('ascii-table');
// let table = new ascii("Commands");
// table.setHeading('COMMANDS', ' LOAD STATUS');

//     readdirSync('./Commands/').forEach(async dir => {
//         if (dir === "mjs") {
//             const cmd = readdirSync(`./Commands/${dir}`).filter(file => file.endsWith('.mjs'));
//             console.log(cmd);
//             for (let file of cmd) {
//               console.log(file)
//                 let pull0 = await import(`../Commands/${dir}/${file}`).then((name)=>{console.log(name)});
//                 // console.log(pull0);
//                 // if (pull0.name) {
//                 //     client.cmd.set(pull0.name, pull0);
//                 //     table.addRow(file, 'COMMAND REGISTERED')
//                 // } else {
//                 //     table.addRow(file, 'COMMAND UNREGISTERED')
//                 //     continue;
//                 // } if (pull0.aliases && Array.isArray(pull0.aliases)) pull0.aliases.forEach(alias => client.aliases.set(alias, pull0.name));
//             };
//         }
//     console.log(table.toString());
// }
//     )
