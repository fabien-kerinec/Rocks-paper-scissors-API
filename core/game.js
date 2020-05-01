const ROCK = 0
const PAPER = 1
const SCISSORS = 2

class Game {
    constructor(idSession, idPlayer) {
        this.session = idSession
        this.players = []
        this.players.push({
            idPlayer,
            pseudo: idPlayer,
            choice: null,
            point: 0
        })
        this.viewers = []
        this.messages = []
        console.log('New session : ', this.session)
    }

    getSumPlayers() {
        return this.players.length
    }

    getPseudo(idPlayer) {
        var pseudo = ''
        this.players.forEach(player => {
            if (idPlayer == player.idPlayer) {
                pseudo = player.pseudo
            }
        });
        this.viewers.forEach(player => {
            if (idPlayer == player.idPlayer) {
                pseudo = player.pseudo
            }
        });
        return pseudo
    }

    changePseudo(idPlayer, pseudo) {
        this.players.forEach(player => {
            if (player.idPlayer == idPlayer) {
                player.pseudo = pseudo
            }
        });
        this.viewers.forEach(player => {
            if (player.idPlayer == idPlayer) {
                player.pseudo = pseudo
            }
        });
    }

    getResults() {
        let localPlayer = []
        localPlayer.push(JSON.parse(JSON.stringify(this.players[0])))
        localPlayer.push(JSON.parse(JSON.stringify(this.players[1])))

        let results = {
            win: {},
            result: {},
            player: localPlayer
        }

        switch (localPlayer[0].choice) {
            case ROCK:
                switch (localPlayer[1].choice) {
                    case ROCK:
                        this.playerEgality()
                        results.win.en = "Egality !"
                        results.win.fr = "Egalité !"
                        results.win.it = "Parità!"
                        break;
                    case PAPER:
                        this.playerWin(localPlayer[1].idPlayer)
                        results.win.en = localPlayer[1].pseudo
                        results.win.fr = localPlayer[1].pseudo
                        results.win.it = localPlayer[1].pseudo

                        results.result.en = 'Paper beats rock'
                        results.result.fr = 'La feuille couvre la pierre'
                        results.result.it = 'Carta batte pietra'
                        break;
                    case SCISSORS:
                        this.playerWin(localPlayer[0].idPlayer)
                        results.win.en = localPlayer[0].pseudo
                        results.win.fr = localPlayer[0].pseudo
                        results.win.it = localPlayer[0].pseudo

                        results.result.en = 'Rock beats scissors'
                        results.result.fr = 'La pierre brise les ciseaux'
                        results.result.it = 'Pietra batte forbici'
                        break;
                }
                break;
            case PAPER:
                switch (localPlayer[1].choice) {
                    case ROCK:
                        this.playerWin(localPlayer[0].idPlayer)
                        results.win.en = localPlayer[0].pseudo
                        results.win.fr = localPlayer[0].pseudo
                        results.win.it = localPlayer[0].pseudo

                        results.result.en = 'Paper beats rock'
                        results.result.fr = 'La feuille couvre la pierre'
                        results.result.it = 'Carta batte pietra'
                        break;
                    case PAPER:
                        this.playerEgality()
                        results.win.en = "Egality !"
                        results.win.fr = "Egalité !"
                        results.win.it = "Parità!"
                        break;
                    case SCISSORS:
                        this.playerWin(localPlayer[1].idPlayer)
                        results.win.en = localPlayer[1].pseudo
                        results.win.fr = localPlayer[1].pseudo
                        results.win.it = localPlayer[1].pseudo

                        results.result.en = 'Scissors cuts paper'
                        results.result.fr = 'Les ciseaux coupent la feuille'
                        results.result.it = 'Forbici batte carta'
                        break;
                }
                break;
            case SCISSORS:
                switch (localPlayer[1].choice) {
                    case ROCK:
                        this.playerWin(localPlayer[1].idPlayer)
                        results.win.en = localPlayer[1].pseudo
                        results.win.fr = localPlayer[1].pseudo
                        results.win.it = localPlayer[1].pseudo

                        results.result.en = 'Rock beats scissors'
                        results.result.fr = 'La pierre brise les ciseaux'
                        results.result.it = 'Pietra batte forbici'
                        break;
                    case PAPER:
                        this.playerWin(localPlayer[0].idPlayer)
                        results.win.en = localPlayer[0].pseudo
                        results.win.fr = localPlayer[0].pseudo
                        results.win.it = localPlayer[0].pseudo

                        results.result.en = 'Scissors cuts paper'
                        results.result.fr = 'Les ciseaux coupent la feuille'
                        results.result.it = 'Forbici batte carta'
                        break;
                    case SCISSORS:
                        this.playerEgality()
                        results.win.en = "Egality !"
                        results.win.fr = "Egalité !"
                        results.win.it = "Parità!"
                        break;
                }
                break;
        }

        return results
    }

    playerWin(idPlayer) {
        this.players.forEach(player => {
            player.choice = null
            if (player.idPlayer == idPlayer) {
                player.point++
            }
        });
    }

    playerEgality() {
        this.players.forEach(player => {
            player.choice = null
        });
    }

    playerAction(idPlayer, action) {
        var endGame = true
        this.players.forEach(player => {
            if (player.idPlayer == idPlayer) {
                player.choice = action
            }

            if (player.choice == null) {
                endGame = false
            }
        });

        return endGame
    }

    playerJoin(idPlayer) {
        console.log('Player Join')
        if (this.players.length < 2) {
            this.players.push({
                idPlayer,
                pseudo: idPlayer,
                choice: null,
                point: 0
            })
        } else {
            this.viewers.push({
                idPlayer,
                pseudo: idPlayer,
                choice: null,
                point: 0
            })
        }
    }

    playerLeft(idPlayer) {
        console.log('Player Left')
        this.players = this.players.filter((player) => {
            player.point = 0
            player.choice = null
            return player.idPlayer != idPlayer
        })
        this.viewers = this.viewers.filter((player) => {
            player.point = 0
            player.choice = null
            return player.idPlayer != idPlayer
        })
    }
    newMess(message) {
        this.messages.push(message);
    }
    toJson() {
        return {
            session: this.session,
            player: this.players,
            viewer: this.viewers,
            message: this.messages
        }
    }
}

module.exports = Game