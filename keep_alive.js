//Middleware
var express = require("express");
var app = express();
var path = require("path");

// Middleware to set charset and content type
app.use((req, res, next) => {
  res.charset = "utf-8";
  res.setHeader("Content-Type", "text/html");
  next();
});

// <p>雖然感覺只有抖S的部分（X</p>

app.get("/", function (req, res) {
  var content = `
    <h1>rushia及機器人簡介：</h1>
    <p>Uruha Rushia是hololive三期生, 此機器人是參考露來寫的（？）</p>
    <p>然後現在還是...嗎(?</p>
    <p>完w(X</p><p>
    <a href="https://github.com/alecchangod/discord-rushia-bot">
        <img src="images/github.png" width="100" height="100" alt="GitHub">
    </a>
    <a href="https://zh.wikipedia.org/zh-tw/潤羽露西婭">
        <img src="images/wikipedia.png" width="100" height="100" alt="Wikipedia">
    </a>
  </p>
    <img src="images/rushia.png" alt="Rushia" width="750" height="1069">
  `;

  res.send(content);
});

// Static file middleware for serving images
app.use("/images", express.static(path.join(__dirname, "images")));

const ip = require("ip");
const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
  console.log(`Network access via: ${ip.address()}:${port}!`);
});
