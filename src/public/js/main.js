$(function () {
  //el socket por el que se comunica el cliente
  const socket = io();

  const $messageForm = $("#message-form");
  const $messageBox = $("#message");
  const $chat = $("#chat");

  const $nickForm = $("#nickForm");
  const $nickError = $("#nickError");
  const $nickname = $("#nickname");

  const $users = $("#usernames");

  $nickForm.submit((e) => {
    e.preventDefault();
    socket.emit("new user", $nickname.val(), (data) => {
      if (data) {
        $("#nickWrap").hide();
        $("#contentWrap").show();
      } else {
        $nickError.html(`
        <div class="alert alert-danger">
          That username already exits
        </div>
        `);
      }
      $nickname.val("");
    });
  });

  $messageForm.submit((e) => {
    e.preventDefault();
    socket.emit("send message", $messageBox.val(), (data) => {
      $chat.append(`<p class="error">${data}</p>`);
    });
    $messageBox.val("");
  });

  socket.on("new message", (data) => {
    $chat.append("<b>" + data.nick + "</b>: " + data.msg + "<br/>");
  });

  socket.on("whisper", (data) => {
    $chat.append(
      `<p class="whisper"><b>  ${data.nick} :</b>   ${data.msg}  <br/></p>`
    );
  });

  socket.on("usernames", (data) => {
    let html = "";
    data.map((item) => {
      html += `<p><i class="fas fa-user"></i>  ${item}</p>`;
    });

    $users.html(html);
  });

  socket.on("load old msgs", (msgs) => {
    msgs.map((item) => {
      displayMsg(item);
    });
  });

  function displayMsg(data) {
    $chat.append(
      `<p class="whisper"><b>  ${data.nick} :</b>   ${data.msg}  <br/></p>`
    );
  }
});
