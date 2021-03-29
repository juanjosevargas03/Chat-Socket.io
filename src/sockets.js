const Chat = require("./models/Chat");

module.exports = function (io) {
  let users = {};

  io.on("connection", async (socket) => {
    let c = await Chat.find({});

    console.log("new user connected");

    let messages = await Chat.find({}).skip(c.length - 4);
    /* .sort({ created_at: 1 })
     .limit(8) */ socket.emit(
      "load old msgs",
      messages
    );

    socket.on("new user", (data, callback) => {
      console.log(data);
      if (data in users) {
        callback(false);
      } else {
        callback(true);
        socket.nickname = data;
        users[socket.nickname] = socket;
        updateNickNames();
      }
    });

    socket.on("send message", async (data, callback) => {
      //msg example = "/w joe themessagexxxx"
      var msg = data.trim();

      if (msg.substr(0, 3) === "/w ") {
        msg = msg.substr(3);
        const index = msg.indexOf(" ");
        if (index !== -1) {
          var name = msg.substr(0, index);
          var msg = msg.substr(index + 1);
          if (name in users) {
            users[name].emit("whisper", {
              msg,
              nick: socket.nickname,
            });
          } else {
            callback("Error! Please enter a Valid User");
          }
        } else {
          callback("Error! Please enter your message");
        }
      } else {
        var newMsg = new Chat({
          msg,
          nick: socket.nickname,
        });

        await newMsg.save();

        io.sockets.emit("new message", {
          msg: data,
          nick: socket.nickname,
        });
      }
    });

    socket.on("disconnect", (data) => {
      if (!socket.nickname) return;
      delete users[socket.nickname];
      //users.splice(users.indexOf(socket.nickname), 1);
      updateNickNames();
    });

    function updateNickNames() {
      io.sockets.emit("usernames", Object.keys(users));
    }
  });
};
