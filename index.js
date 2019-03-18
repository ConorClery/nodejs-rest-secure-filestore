const fs = require('fs');
const http = require('http');
const https = require('https');
const privateKey  = fs.readFileSync('ssl/server.key', 'utf8');
const certificate = fs.readFileSync('ssl/server.crt', 'utf8');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const db_options = require('./config.json').DATABASE_OPTIONS;

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
mongoose.connect((db_options.URI_PREFIX + db_options.MONGODB_USER + ":" + db_options.MONGODB_PASS + db_options.URI), { useNewUrlParser: true }, function(err) {
  if (err) throw err;
  console.log("DB connected");
});

router.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

let user_app = require("./apps/user/user.js");
router.post("/user/:option1", user_app);
router.post("/user/:option1/:option2", user_app);
router.get("/user/:option1", user_app);
router.get("/user/:option1/:option2", user_app);
router.patch("/user/:option1", user_app);
router.patch("/user/:option1/:option2", user_app);

let group_app = require("./apps/group/group.js");
router.post("/group/:option1", group_app);
router.get("/group/:option1", group_app)


router.get("/", function (req, res, next) {
  res.send("server is responding well!")
});


app.use('/', router);
httpServer.listen(8080, '0.0.0.0');
httpsServer.listen(8443, '0.0.0.0');
