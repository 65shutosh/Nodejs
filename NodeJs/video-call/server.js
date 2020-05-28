const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));
let clients = 0;
var user = {};

io.on("connection", function (socket) {
  socket.on("NewClient", function () {
    if (clients < 2) {
      if (clients == 1) {
        this.emit("CreatePeer");
      }
    } else this.emit("SessionActive");
    clients++;
    //console.log("Server side - new client");
    user.socketId = this.id;
    user.clientId = clients;
    console.log(
      `after completion of newClient clientId - ${user.clientId} , SocketId -  ${user.socketId}`
    );
  });
  socket.on("Offer", SendOffer);
  socket.on("Answer", SendAnswer);
  socket.on("disconnect", Disconnect);
});

function Disconnect() {
  if (clients > 0) clients--;
}

function SendOffer(offer) {
  this.broadcast.emit("BackOffer", offer);
}

function SendAnswer(data) {
  this.broadcast.emit("BackAnswer", data);
}

http.listen(port, () => console.log(`Active on ${port} port`));
