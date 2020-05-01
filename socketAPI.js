let socket_io = require('socket.io');
let io = socket_io();
let socketApi = {};
//Your socket logic here

const CoreApp = require('./core/app')
const CoreTools = require('./core/tools')
let App = new CoreApp()
socketApi.io = io;
io.on('connection', function (socket) {
  // Generate Game
  let idSession = CoreTools.uniqueId()
  let idPlayer = CoreTools.uniqueId()

  App.newChannel(io, socket, idSession, idPlayer)
  socket.emit('yourID', {
    pseudo: idPlayer,
    idPlayer
  })

  // Pseudo
  socket.on('changePseudo', function ({
    pseudo
  }) {
    App.changePseudo(io, socket, idSession, idPlayer, pseudo)
    var data = {
      text: `User ${pseudo} connected to chat`,
      type: 'admin',
      user: {
        idPlayer: idPlayer,
        pseudo: pseudo
      }
    }
    App.addMessage(io, socket, idSession, data);
    socket.emit('yourID', {
      pseudo,
      idPlayer
    })
  })

  // Disconnect
  socket.on('disconnect', function () {
    App.disconnect(io, socket, idSession, idPlayer)
  });

  // Join game
  socket.on('join', ({
    session
  }) => {
    let isSuccess = App.joinChannel(io, socket, idSession, session, idPlayer)
    if (isSuccess) {
      idSession = session
    }
  });

  // Choice
  socket.on('choice', ({
    choice
  }) => {
    App.setChoice(io, socket, idSession, idPlayer, choice)
  });

  socket.on('createMessage', (data, cb) => {
    App.addMessage(io, socket, idSession, data);
    cb();
  });
});
module.exports = socketApi;