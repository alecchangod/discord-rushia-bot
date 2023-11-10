import captureWebsite from "capture-website";

export const name = "ss";
export const aliases = ["ss"];
export const description = "screenshot website";

export async function run(client, message, args, secret, prefix, trans) {
  let url = message?.content?.split(" ")[1] || args;

  if (!url.startsWith("http")) {
    console.log(`ss: Not start with http! ${url}`);
    url = `https://${url}`;
  }

  await captureWebsite.file(url, "screenshot/screenshot.png", {
    darkMode: true,
    width: 2400,
    height: 1080,
    fullPage: true,
    overwrite: true,
  });

  if (message?.channel?.id) {
    var ss_of = trans.strings.find((it) => it.name === "ss_of").trans;
    message.channel.send({
      content: `\`\`${url}\`\` ${ss_of}`,
      files: ["screenshot/screenshot.png"],
    });
  }
}
