import captureWebsite from 'capture-website';
export const name = "ss";
export const aliases = ["ss"];
export const description = 'screenshot website';
export async function run(client, message, args, secret) {
    var url = message?.content?.split(" ")[1] || args;
    if(!url.startsWith("http")) {
        console.log(`not start with http! ${url}`);
        var url = `https://${url}`
    }
    // if(message?.content?.split(" ")[2] === "full" || args) var tf = true;
    // else var tf = false;
    await captureWebsite.file(url, 'screenshot/screenshot.png', {
    darkMode: true, width: 2400, height: 1080, fullPage: true, overwrite: true
});
    if(message?.channel?.id) message.channel.send({content: `Screenshot of ${url}`, files: ['screenshot/screenshot.png']})
}