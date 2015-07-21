import fs from "fs";
import http from "http";
import path from "path";
import express from "express";

let app = express();
let server = http.createServer(app);
let port = 8000;

app.set("view engine", "ejs");

app.use(express.static(path.resolve(__dirname, "public")));
app.use("/output", express.static(path.resolve(__dirname, "output")));

app.get("/", function(req, res) {
  fs.readdir("output", function(error, files) {
    res.render("index", { files });
  });
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  next(err);
});

server.listen(port, function() {
  console.log(`listening on port ${port}`);
});
