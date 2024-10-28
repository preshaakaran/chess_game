"use strict";
// interface Game {
//     id: number;
//     name: string;
//     player1: WebSocket;
//     player2: WebSocket;
// }
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "black"
            }
        }));
    }
    makeMove(socket, move) {
        // Check if it's the correct player's turn
        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            console.log('Player 1 turn, but player 2 tried to move.');
            return;
        }
        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            console.log('Player 2 turn, but player 1 tried to move.');
            return;
        }
        // Attempt to make the move
        try {
            this.board.move(move);
        }
        catch (e) {
            console.log('Invalid move:', e);
            return;
        }
        // Log the move count
        console.log('Move count:', this.moveCount);
        console.log('Move count % 2:', this.moveCount % 2);
        if (this.board.isGameOver()) {
            const winner = this.board.turn() === "w" ? "black" : "white";
            this.player1.send(JSON.stringify({ type: messages_1.GAME_OVER, payload: { winner } }));
            this.player2.send(JSON.stringify({ type: messages_1.GAME_OVER, payload: { winner } }));
            return;
        }
        // Send move to the correct player
        if (this.moveCount % 2 === 0) {
            this.player2.send(JSON.stringify({ type: messages_1.MOVE, payload: move }));
        }
        else {
            this.player1.send(JSON.stringify({ type: messages_1.MOVE, payload: move }));
        }
        this.moveCount++;
    }
}
exports.Game = Game;
