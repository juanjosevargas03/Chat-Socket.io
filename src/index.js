const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/chat-database")
  .then((db) => console.log("mongodb is connected"))
  .catch((error) => console.log(error));

/* app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/");
}); */

//settings
app.set("port", process.env.PORT || 3000);

require("./sockets")(io);

//static files
app.use(express.static(path.join(__dirname + "/public")));

http.listen(app.get("port"), () => {
  console.log("listening on", app.get("port"));
});
