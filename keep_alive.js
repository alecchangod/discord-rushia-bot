var express = require('express');
var app = express();
//Middleware

app.get('/',function(req, res) {
    var content = "rushia及機器人簡介： \n Uruha Rushia是hololive三期生, 此機器人是參考露來寫的（？）\n \n 雖然感覺只有抖S的部分（X \n \n end(X ";

    res.charset = 'utf-8';
    res.contentType('text');
    res.send(content);
});


const ip = require('ip');
const port = 3000

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
  console.log(`Network access via: localhost:${port}!`);
});
