const express = require("express");
const app = express();
const server = app.listen(8004, () => console.log("listening on port 8004"));
const io = require("socket.io")(server);
const users = {};

app.use(express.static(__dirname + "/static"));

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

//when user is connected
io.on("connection", function (socket) {
  socket.on("new_user", (user_name) => {
    io.emit("connected_user", { user_name: user_name, socket_id: socket.id });
  });

  //when user sends a message
  socket.on("sending_msg", (data) => {
    if (data.recipient === "Everyone") {
      io.emit("send_msg_all", { data }); //broadcast to all connected users
      for (x in users) {
        console.log(users[x]);
      }
    }
  });
  // when user disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected!");
    delete users[socket.id];
    io.emit("disconnected_user", { socket_id: socket.id });
  });
});

//render the index page including the users
app.get("/", function (req, res) {
  res.render("index", { users });
});
