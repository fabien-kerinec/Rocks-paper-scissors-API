let socket_io = require('socket.io');
let io = socket_io();
let socketApi = {};
//Your socket logic here

const CoreApp = require('./core/app');
const CoreTools = require('./core/tools');
let App = new CoreApp();
socketApi.io = io;
io.on('connection', function (socket) {
  // Generate Game
  let idSession = CoreTools.uniqueId();
  let idPlayer = CoreTools.uniqueId();

  // App.newChannel(io, socket, idSession, idPlayer)
  // socket.emit('yourID', {
  //   pseudo: idPlayer,
  //   idPlayer,
  // });
  socket.on('newChan', (data) => {
    console.log('newChan');
    App.newChannel(io, socket, data, idPlayer);
    idSession = data;
  });
  // Pseudo
  socket.on('changePseudo', function (data) {

    console.log('changePseudo');
    App.changePseudo(io, socket, data.session, idPlayer, data.pseudo);
    var m = new Date();
    var dateString =
      m.getUTCFullYear() +
      '/' +
      ('0' + (m.getUTCMonth() + 1)).slice(-2) +
      '/' +
      ('0' + m.getUTCDate()).slice(-2) +
      ' ' +
      ('0' + m.getUTCHours()).slice(-2) +
      ':' +
      ('0' + m.getUTCMinutes()).slice(-2) +
      ':' +
      ('0' + m.getUTCSeconds()).slice(-2);
    var mess = {
      text: `User ${data.pseudo} connected to chat`,
      type: 'admin',
      time: dateString,
      user: {
        idPlayer: idPlayer,
        pseudo: data.pseudo,
      },
    };
    let pseudo = data.pseudo
    App.addMessage(io, socket, data.session, mess);
    socket.emit('yourID', {
      pseudo,
      idPlayer,
    });
  });

  // Disconnect
  socket.on('disconnect', function () {
    console.log('disconnect');
    App.disconnect(io, socket, idSession, idPlayer);
  });

  // Join game
  socket.on('join', ({
    session
  }) => {
    console.log('join');
    let isSuccess = App.joinChannel(io, socket, idSession, session, idPlayer);
    if (isSuccess) {
      idSession = session;
    }
  });
  socket.on('joinRoom', (data, cb) => {
    console.log('joinRoom');
    let join = App.joinChannelBis(io, socket, idSession, data);
    if (join) {
      io.in(idSession).emit('disableModal', {
        status: 'ok',
        player: idPlayer
      });
    } else {
      io.in(idSession).emit('disableModal', {
        status: 'nok',
        player: idPlayer
      });
    }


  });


  // Choice
  socket.on('choice', ({
    choice
  }) => {
    console.log('choice');
    App.setChoice(io, socket, idSession, idPlayer, choice);
  });

  socket.on('createMessage', (data, cb) => {
    console.log('createMessage');
    App.addMessage(io, socket, idSession, data);
    io.in(idSession).emit('newMessage');
    cb();
  });
  socket.on('checkRoom', (data, cb) => {
    console.log('checkRoom');
    let check = App.checkRoom(io, socket, data);
    cb(check);
  });
  socket.on('continueGame', (data, cb) => {
    console.log('continueGame');
    io.in(idSession).emit('resetResult');
  });
});
module.exports = socketApi;