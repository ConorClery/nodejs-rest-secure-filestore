const fs = require('fs');
const http = require('http');
const https = require('https');
const privateKey  = fs.readFileSync('ssl/server.key', 'utf8');
const certificate = fs.readFileSync('ssl/server.crt', 'utf8');
const bodyParser = require("body-parser");

const credentials = {key: privateKey, cert: certificate};
const express = require('express');
const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());
// your express configuration here

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

router.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

let user_app = require("./apps/user/user.js");
router.post("/user/:option", user_app);
router.get("/user/:option", user_app);

router.get("/", function (req, res, next) {
  console.log("Client said " + req);
  next()
}, function(req, res) {
  res.send("server is responding well!")
});

app.use('/', router);

httpServer.listen(8080, '0.0.0.0');
httpsServer.listen(8443, '0.0.0.0');
