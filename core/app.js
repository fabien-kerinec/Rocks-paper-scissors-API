const CoreGame = require('./game');

class App {
    constructor(idSession) {
        this.ArrayGames = [];
    }

    /* Stats */
    getSumGames() {
        return Object.keys(this.ArrayGames).length;
    }

    getSumPlayers() {
        let num = 0;
        for (let key in this.ArrayGames) {
            num += this.ArrayGames[key].getSumPlayers();
        }
        return num;
    }

    /* Pseudo */
    changePseudo(io, socket, idSession, idPlayer, pseudo) {
        this.ArrayGames[idSession].changePseudo(idPlayer, pseudo);
        this.connected(io, this.ArrayGames[idSession]);
    }

    /* Connexion */
    connected(io, game) {
        console.log('Connected : ', game.session);
        io.in(game.session).emit(
            'connected',
            this.ArrayGames[game.session].toJson()
        );
    }

    disconnect(io, socket, idSession, idPlayer) {
        if (this.ArrayGames[idSession]) {

            this.ArrayGames[idSession].playerLeft(idPlayer);
            if (this.ArrayGames[idSession].players) {
                console.log('player able');
                if (this.ArrayGames[idSession].players.length < 2) {
                    io.in(idSession).emit('joinParty', idPlayer);
                }
            }
            this.connected(io, this.ArrayGames[idSession]);
            this.cleanChannel();
        }
    }

    /* Channel */
    newChannel(io, socket, idSession, idPlayer, isJoin = false) {
        if (isJoin || this.ArrayGames[idSession]) {

            this.ArrayGames[idSession].playerJoin(idPlayer);
        } else {
            this.ArrayGames[idSession] = new CoreGame(idSession, idPlayer);
        }

        socket.join(idSession);
        this.connected(io, this.ArrayGames[idSession].toJson());
    }
    joinChannelBis(io, socket, idSession, idPlayer) {

        if (this.ArrayGames[idSession] && this.ArrayGames[idSession].players.length < 2) {

            this.ArrayGames[idSession].playerJoinBis(idPlayer);
            this.ArrayGames[idSession].viewerLeft(idPlayer);
            this.connected(io, this.ArrayGames[idSession].toJson());
            return true;
        }
        return false;
    }

    joinChannel(io, socket, oldSession, newSession, idPlayer) {
        if (this.ArrayGames[newSession] != undefined) {
            this.ArrayGames[oldSession].playerLeft(idPlayer);
            this.newChannel(io, socket, newSession, idPlayer, true);
            return true;
        }

        return false;
    }


    cleanChannel() {
        for (let key in this.ArrayGames) {
            if (this.ArrayGames[key].getSumPlayers() == 0) {
                delete this.ArrayGames[key];
            }
        }
    }

    /* Choice */
    setChoice(io, socket, idSession, idPlayer, choice) {
        var endGame = this.ArrayGames[idSession].playerAction(idPlayer, choice);
        io.in(idSession).emit('haveChoice', {
            pseudo: this.ArrayGames[idSession].getPseudo(idPlayer),
        });

        if (endGame) {
            io.in(idSession).emit('results', this.ArrayGames[idSession].getResults());
            this.connected(io, this.ArrayGames[idSession]);
        }
    }

    addMessage(io, socket, idSession, data) {
        let message;
        if (!data.type) {
            message = {
                text: data.text,
                user: data.user,
                type: data.type,
                time: new Date().toString().slice(15, 24),
            };
        } else {
            message = {
                text: data.text,
                user: data.user,
                type: data.type,
                time: data.time,
            };
        }
        this.ArrayGames[idSession].newMess(message);
        this.connected(io, this.ArrayGames[idSession]);
    }

    checkRoom(io, socket, data) {
        if (this.ArrayGames[data]) {
            return true;
        }
        return false;
    }
}

module.exports = App;