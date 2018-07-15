var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var fs = require("fs");
var path = require("path")
var base64 = require("urlsafe-base64");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ limit:'50mb',extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

var server = app.listen(3000, function () {
  console.log('Node.js is listen to PORT:' + server.address().port);
});

app.post("/api/upimage", function(req, res, next) {
  console.log("up-image");
  var filepath = 'images/' + req.body.label + '/image' + req.body.filename + '.png';
  var dirname = path.dirname(filepath);
  res.header(
    'Access-Control-Allow-Origin','*'
  );

  fs.access(dirname, fs.constants.R_OK | fs.constants.W_OK, (error) => {
    if (error) {
      if (error.code == "ENOENT") {
        fs.mkdir(dirname, (error) => {
          // ディレクトリ作成時にエラーとなった場合、（他処理が作ったとか。）
          // 多分他の処理がディレクトリ作ったとかなので無視する。
        });
      } else {
        res.json("unexpected error.");
        return;
      }
    }
  });

  var img = base64.decode(req.body.image);
  fs.writeFile(filepath, img, function (err) {
    if (err) {
      console.log(err);
      res.json(err);
    } else {
      res.json("upload success.");
    }
  });
});

app.get("/scan", function (req, res, next) {
  res.render("index", {});
});

app.get("/predict.html", function (req, res, next) {
  res.render("predict", {});
})

app.get("/", function (req, res, next) {
  res.render("forcePush", {});
})